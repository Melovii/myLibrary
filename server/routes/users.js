const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../dbs');

// Logion a user //TODO: (CHECK IF THIS SHIT IS GOOD DAWG)
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
  console.log("Received register request:", req.body);

  if (!name || !password) {
	console.log("Missing username or password");
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if username already exists
	console.log("Checking if username already exists");
    const checkQuery = 'SELECT * FROM Users WHERE username = ?';
	
    connection.query(checkQuery, [name], async (err, results) => {
      if (err) {
		console.log("Error during user check:", err);
        return res.status(500).json({ error: 'Database error while checking user' });
      }

	  console.log("User check results:", results);
	  
      if (results.length > 0) {
		console.log("Username already taken");
        return res.status(409).json({ error: 'Username already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
	  console.log("Inserting user: ", name, hashedPassword);

      // Insert the user
      const insertQuery = `
        INSERT INTO Users (username, pass_hash)
        VALUES (?, ?)
      `;
      connection.query(insertQuery, [name, hashedPassword], (err) => {
        if (err) {
			console.log("Error inserting user:", err);
        	return res.status(500).json({ error: 'Error inserting user' });
        }
		console.log("User registered successfully");
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
	console.log("Caught error during registration:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
