const express = require('express');
const router = express.Router();
const connection = require('../dbs');

// Route to get all books
router.get('/books', (req, res) => {
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
router.post('/addBook', (req, res) => {
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
router.delete('/removeBook', (req, res) => {
  const { bookID } = req.body;
  const query = 'DELETE FROM Books WHERE book_id = ?';

  connection.query(query, [bookID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error removing book' });
    }
    res.status(200).json({ message: 'Book removed successfully' });
  });
});

// Route to update read status
router.put('/updateReadStatus', (req, res) => {
  const { bookID, isRead } = req.body;
  const query = 'UPDATE Books SET is_read = ? WHERE book_id = ?';
  connection.query(query, [isRead, bookID], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating read status' });
    }
    res.status(200).json({ message: 'Read status updated successfully' });
  });
});

module.exports = router;
