# 📚 myLibrary

A simple Node.js + Express + MySQL project to manage your library of books.  
[🔗 Live Demo](https://melovii.github.io/myLibrary/)

---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### 📦 Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

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

## 🔐 Setting up Environment Variables

Create a `.env` file in the root directory of the project.

Add your MySQL credentials and database name:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
PORT=3000
```

Note: Never commit your `.env` file to version control.

## 🧠 Initializing the Database

Make sure you have a MySQL database created and accessible. You can use the following to create one:

```sql
CREATE DATABASE your_database_name;
```

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

## 🛠 Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Installs dependencies |
| `npm start` | Starts the server (if added) |
| `node server.js` | Starts the server manually |

## ❓ FAQ

**What if I get a "using password: NO" error?**  
Make sure your `.env` file is correctly set and that DB_PASSWORD is not empty or misspelled.
