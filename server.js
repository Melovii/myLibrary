const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
dotenv.config();

const connection = require('./dbs');

const app = express();

app.use(express.json());

// API routes first

// Route to get all books
app.get('/books', (req, res) => {
  const query = `
    SELECT Books.*, Authors.name as author
    FROM Books
    JOIN Authors on Books.author_id = Authors.author_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching books' });
    }
    res.status(200).json(results);
  });
});

// Route to add a book
app.post('/addBook', (req, res) => {
  const { title, author, pages, isRead } = req.body;

  const authorQuery = 'SELECT author_id FROM Authors WHERE name = ?';
  connection.query(authorQuery, [author], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching author' });
    }

    let authorId;
    if (results.length === 0) {
      const insertAuthorQuery = 'INSERT INTO Authors (name) VALUES (?)';
      connection.query(insertAuthorQuery, [author], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error adding author' });
        }
        authorId = results.insertId;
        const bookQuery = 'INSERT INTO Books (title, author_id, pages, is_read) VALUES (?, ?, ?, ?)';
        connection.query(bookQuery, [title, authorId, pages, isRead], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error adding book' });
          }
          res.status(201).json({ message: 'Book added successfully' });
        });
      });
    } else {
      authorId = results[0].author_id;
      const bookQuery = 'INSERT INTO Books (title, author_id, pages, is_read) VALUES (?, ?, ?, ?)';
      connection.query(bookQuery, [title, authorId, pages, isRead], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error adding book' });
        }
        res.status(201).json({ message: 'Book added successfully' });
      });
    }
  });
});

// Route to remove a book
app.delete('/removeBook', (req, res) => {
  const { bookID } = req.body;
  const query = 'DELETE FROM Books WHERE book_id = ?';

  connection.query(query, [bookID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error removing book' });
    }
    res.status(200).json({ message: 'Book removed successfully' });
  });
});

app.put('/updateReadStatus', (req, res) => {
  const { bookID, isRead } = req.body;
  const query = 'UPDATE Books SET is_read = ? WHERE book_id = ?';
  connection.query(query, [isRead, bookID], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating read status' });
    }
    res.status(200).json({ message: 'Read status updated successfully' });
  });
});

// Register a new user
app.post('/register', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if username already exists
    const checkQuery = 'SELECT * FROM Users WHERE name = ?';
    connection.query(checkQuery, [name], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while checking user' });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: 'Username already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user
      const insertQuery = `
        INSERT INTO Users (name, pass_hash)
        VALUES (?, ?)
      `;
      connection.query(insertQuery, [name, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error inserting user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html on root GET request explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
