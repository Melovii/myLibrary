// ! This file is responsible for connecting to the MySQL database.

// ? Require the mysql2 package (MySQL client for Node.js which allows us to connect to a MySQL database from Node.js)
const MySQL = require('mysql2');
require('dotenv').config();

// ? Create a connection to MySQL without a database
const connection = MySQL.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
});

// ? Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);

    // ? Create the database if it doesn't exist
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'myLibrary'}`;
    connection.query(createDatabaseQuery, (err, results) => {
        if (err) {
            console.error('Error creating database:', err);
        } else {
            console.log('Database created or already exists.');
        }

        // ? Now connect to the newly created database
        const useDatabaseQuery = `USE ${process.env.DB_NAME || 'myLibrary'}`;
        connection.query(useDatabaseQuery, (err) => {
            if (err) {
                console.error('Error selecting the database:', err);
                return;
            }
            console.log(`Using database ${process.env.DB_NAME || 'myLibrary'}`);

            // ? Set up tables
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

			// ? Run the queries sequentially
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

                        // ? Close the connection after the tables are created
                        connection.end();
                    });
                });
            });
        });
    });
});
