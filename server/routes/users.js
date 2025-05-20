const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../dbs');

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  console.log("Received login request:", req.body);

  if(!name || !password) {
    console.log("Missing credentials");
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    console.log("Checking for existing user...");
    const checkQuery = 'SELECT * FROM Users WHERE username = ?';

    connection.query(checkQuery, [name], async (err, results) => {
      if (err) {
        console.log("Error during user check:", err);
        return res.status(500).json({ error: 'Database error while checking user' });
      }

      console.log("User check results:", results);

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const validPassword = await bcrypt.compare(password, results[0].pass_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      res.status(200).json({
        message: 'Login successful',
        // userId: results[0].user_id,
      });
    })
  } catch (err) {
    console.log("Caught exception in try block:", err);
    res.status(500).json({ error: 'Server error' });
  }
})

// Register a new user
router.post('/register', async (req, res) => {
  const { name, password } = req.body;
  console.log("Received register request:", req.body); // Step 1

  if (!name || !password) {
    console.log("Missing credentials"); // Step 2
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    console.log("Checking for existing user..."); // Step 3
    const checkQuery = 'SELECT * FROM Users WHERE username = ?';

    connection.query(checkQuery, [name], async (err, results) => {
      if (err) {
        console.log("Error during user check:", err); // Step 4
        return res.status(500).json({ error: 'Database error while checking user' });
      }

      console.log("User check results:", results); // Step 5

      if (results.length > 0) {
        console.log("Username already exists"); // Step 6
        return res.status(409).json({ error: 'Username already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Inserting user:", name, hashedPassword); // Step 7

      // Insert the user
      const insertQuery = `
        INSERT INTO Users (username, pass_hash)
        VALUES (?, ?)
      `;
      connection.query(insertQuery, [name, hashedPassword], (err) => {
        if (err) {
          console.log("Error inserting user:", err); // Step 8
          return res.status(500).json({ error: 'Error inserting user' });
        }
        console.log("User inserted successfully"); // Step 9
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.log("Caught exception in try block:", err); // Step 10
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
