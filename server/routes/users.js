const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../dbs');

// Register a new user
router.post('/register', async (req, res) => {
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

module.exports = router;
