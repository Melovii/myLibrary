# 📚 myLibrary

A simple Node.js + Express + MySQL project to manage your personal library of books with a clean, interactive interface.

## ✨ Features

- 📖 Add books with title, author, and page count
- ✅ Mark books as read/unread with toggle functionality
- 🗑️ Remove books from your library
- 💾 Persistent storage with MySQL database
- 🖥️ Clean, responsive web interface
- 🔄 Real-time updates without page refresh

---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MySQL](https://www.mysql.com/) (version 5.7 or higher)

---

## 📁 Cloning the Repository

```bash
git clone https://github.com/your-username/myLibrary.git
cd myLibrary
```

## 🔧 Installing Dependencies

```bash
npm install
```

## 🗄️ Database Setup

1. **Create a MySQL database:**
```sql
CREATE DATABASE your_database_name;
USE your_database_name;
```

2. **Create the required tables:**
```sql
-- Books table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    pages INT,
    is_read BOOLEAN DEFAULT FALSE,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for future multi-user support)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Setting up Environment Variables

Create a `.env` file in the root directory of the project:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
PORT=3000
```

⚠️ **Important:** Never commit your `.env` file to version control. Make sure `.env` is listed in your `.gitignore` file.

## ▶️ Running the Server

```bash
npm start
```

Or:

```bash
node server.js
```

You should see:
```
Server is running on port 3000
Connected to the database!
```

Then visit `http://localhost:3000` in your browser.

## 🚀 Deployment Options

Since this project requires a MySQL database, you'll need a hosting service that supports Node.js and MySQL:

- **Recommended:** [Railway](https://railway.app/), [Heroku](https://heroku.com/), [DigitalOcean](https://www.digitalocean.com/)
- **Database:** MySQL hosting or cloud database services like PlanetScale, Amazon RDS

Static hosting services (like GitHub Pages, Netlify, Vercel) won't work for this backend application.

## 🛠 Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Installs dependencies |
| `npm start` | Starts the server |
| `node server.js` | Starts the server manually |

## 📁 Project Structure

```
myLibrary/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env               # Environment variables (create this)
├── .gitignore         # Git ignore file
├── public/            # Static frontend files
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styles
│   ├── script.js      # Main frontend logic
│   ├── Library.js     # Library class (manages books collection)
│   └── Book.js        # Book class (individual book model)
└── README.md
```

## 🏗️ Application Architecture

This project follows a client-server architecture:

- **Frontend:** Vanilla JavaScript with ES6 modules
  - `Book.js` - Individual book model class
  - `Library.js` - Collection manager with database interaction
  - `script.js` - Main application logic and DOM manipulation

- **Backend:** Node.js + Express + MySQL
  - RESTful API endpoints for CRUD operations
  - Database connection and query handling

- **Database:** MySQL with normalized tables for books and users

## ❓ FAQ

**Q: What if I get a "using password: NO" error?**  
A: Make sure your `.env` file is correctly configured and that `DB_PASSWORD` is not empty or misspelled.

**Q: Can I use a different database?**  
A: Yes, but you'll need to modify the database connection code in `server.js` and update the SQL queries accordingly.

**Q: How do I add sample data?**  
A: You can insert sample books using SQL:
```sql
INSERT INTO books (title, author, pages, is_read, user_id) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 180, FALSE, 1),
('To Kill a Mockingbird', 'Harper Lee', 376, TRUE, 1),
('1984', 'George Orwell', 328, FALSE, 1);
```

**Q: What API endpoints are available?**  
A: The application provides these REST endpoints:
- `GET /books` - Fetch all books
- `POST /addBook` - Add a new book  
- `DELETE /removeBook` - Remove a book by ID
- `PUT /updateReadStatus` - Toggle read status of a book

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
