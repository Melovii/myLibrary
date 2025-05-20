const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve index.html explicitly on root GET request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Import routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use(bookRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
