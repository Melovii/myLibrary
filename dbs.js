const MySQL = require('mysql2');
require('dotenv').config();

const connection = MySQL.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'myLibrary'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);

    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'myLibrary'}`;
    connection.query(createDatabaseQuery, (err, results) => {
        if (err) {
            console.error('Error creating database:', err);
        } else {
            console.log('Database created or already exists.');
        }

        const useDatabaseQuery = `USE ${process.env.DB_NAME || 'myLibrary'}`;
        connection.query(useDatabaseQuery, (err) => {
            if (err) {
                console.error('Error selecting the database:', err);
                return;
            }
            console.log(`Using database ${process.env.DB_NAME || 'myLibrary'}`);

            const createAuthorsTableQuery = `
                CREATE TABLE IF NOT EXISTS Authors
                (
                    author_id   INT AUTO_INCREMENT,
                    name        VARCHAR(50),
                    PRIMARY KEY (author_id)
                );
            `;

            const createBooksTableQuery = `
                CREATE TABLE IF NOT EXISTS Books
                (
                    book_id     INT AUTO_INCREMENT,
                    author_id   INT,
                    pages       INT,
                    title       VARCHAR(50),
                    is_read     BOOLEAN DEFAULT FALSE,
                    PRIMARY KEY (book_id),
                    FOREIGN KEY (author_id) REFERENCES Authors(author_id) ON DELETE CASCADE
                );
            `;
            
            const createUsersTableQuery = `
                CREATE TABLE IF NOT EXISTS Users
                (
                    user_id     INT AUTO_INCREMENT,
                    name        VARCHAR(69),
                    email       VARCHAR(69) UNIQUE,
                    pass_hash   VARCHAR(255),
                    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    books_read  INT DEFAULT 0,
                    role ENUM('admin', 'user') DEFAULT 'user',
                    PRIMARY KEY (user_id)
                );
            `;

            connection.query(createAuthorsTableQuery, (err) => {
                if (err) {
                    console.error('Error creating Authors table:', err);
                } else {
                    console.log('Authors table created successfully.');
                }

                connection.query(createBooksTableQuery, (err) => {
                    if (err) {
                        console.error('Error creating Books table:', err);
                    } else {
                        console.log('Books table created successfully.');
                    }

                    connection.query(createUsersTableQuery, (err) => {
                        if (err) {
                            console.error('Error creating Users table:', err);
                        } else {
                            console.log('Users table created successfully.');
                        }
                    });
                });
            });
        });
    });
});

module.exports = connection;
