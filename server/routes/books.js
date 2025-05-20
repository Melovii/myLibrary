const express = require('express');
const router = express.Router();
const connection = require('../dbs');

// API routes first

// Route to get all books
router.get('/books', (req, res) => {
  // Only return books for user_id = 1 for now // TODO: CHANGE LATER :SOB:
  const query = `
    SELECT * FROM Books WHERE user_id = 1
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
  const { title, author, pages, isRead, userId } = req.body;

  const query = `
    INSERT INTO Books (title, author, pages, is_read, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [title, author, pages, isRead, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding book' });
    }
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
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
