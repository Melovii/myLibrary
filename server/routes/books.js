const express = require('express');
const router = express.Router();
const connection = require('../dbs');

// 🆕 Optional helper middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}

// API routes first

// Route to get all books
router.get('/books', (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'User not logged in' });
  const query = `
    SELECT 
      b.book_id,
      b.title,
      b.author,
      b.pages,
      b.is_read,
      b.user_id,
      c.name AS category_name
    FROM Books b
    LEFT JOIN BookCategories bc ON b.book_id = bc.book_id
    LEFT JOIN Categories c ON bc.category_id = c.category_id
    WHERE b.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching books' });
    }
    res.status(200).json(results);
  });
});


// Route to add a book
router.post('/addBook', (req, res) => {
  const { title, author, pages, isRead, categoryName } = req.body;

  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'User not logged in' });
  const query = `
    INSERT INTO Books (title, author, pages, is_read, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [title, author, pages, isRead, userId], (err, result) => {
    if (err) {
      console.error('Error while inserting book:', err); // <-- THIS IS IMPORTANT
      return res.status(500).json({ error: 'Error adding book' });
    }

    const bookId = result.insertId;

    if (categoryName) {
      const getCategoryIdQuery = `
        SELECT category_id FROM Categories WHERE name = ?
      `;

      connection.query(getCategoryIdQuery, [categoryName], (err, results) => {
        if (err) {
          console.error('Error fetching category ID:', err);
          return res.status(500).json({ error: 'Error fetching category ID' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'Invalid category name' });
        }

        const categoryId = results[0].category_id;

        const insertCategoryLinkQuery = `
          INSERT INTO BookCategories (book_id, category_id)
          VALUES (?, ?)
        `;

        connection.query(insertCategoryLinkQuery, [bookId, categoryId], (err) => {
          if (err) {
            console.error('Error linking book to category:', err);
            return res.status(500).json({ error: 'Book added, but failed to link category' });
          }

          res.status(201).json({ message: 'Book added with category', bookId });
        });
      });
    } else {
      res.status(201).json({ message: 'Book added without category', bookId });
    }
  });
});

// Route to remove a book
router.delete('/removeBook', (req, res) => {
  const userId = req.session.userId;
  console.log('DELETE /removeBook userId:', userId);
  console.log('Body:', req.body);

  if (!userId) return res.status(401).json({ error: 'User not logged in' });

  const { bookID } = req.body;
  const query = 'DELETE FROM Books WHERE book_id = ? AND user_id = ?';

  connection.query(query, [bookID, userId], (err, results) => {
    if (err) {
      console.error('Error removing book:', err);
      return res.status(500).json({ error: 'Error removing book' });
    }
    res.status(200).json({ message: 'Book removed successfully' });
  });
});


// Route to update read status
router.put('/updateReadStatus', (req, res) => {
  const userId = req.session.userId;
  console.log('PUT /updateReadStatus userId:', userId);
  console.log('Body:', req.body);

  if (!userId) return res.status(401).json({ error: 'User not logged in' });

  const { bookID, isRead } = req.body;
  const query = 'UPDATE Books SET is_read = ? WHERE book_id = ? AND user_id = ?';

  connection.query(query, [isRead, bookID, userId], (err) => {
    if (err) {
      console.error('Error updating read status:', err);
      return res.status(500).json({ error: 'Error updating read status' });
    }
    res.status(200).json({ message: 'Read status updated successfully' });
  });
});


module.exports = router;
