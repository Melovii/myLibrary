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
    connection.query(createDatabaseQuery, (err) => {
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

            // Create Users table
            const createUsersTableQuery = `
                CREATE TABLE IF NOT EXISTS Users
                (
                    user_id     INT AUTO_INCREMENT,
                    username    VARCHAR(69) UNIQUE NOT NULL,
                    pass_hash   VARCHAR(255) NOT NULL,
                    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id)
                );
            `;

			// TODO: Ask user for category in the add book form
            // Create Categories table linked to Users
            const createCategoriesTableQuery = `
                CREATE TABLE IF NOT EXISTS Categories
                (
                    category_id INT AUTO_INCREMENT,
                    user_id     INT NOT NULL,
                    name        VARCHAR(50) NOT NULL,
                    UNIQUE (user_id, name),
                    PRIMARY KEY (category_id),
                    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
                );
            `;

            // Create Books table linked to Users and Categories
            const createBooksTableQuery = `
                CREATE TABLE IF NOT EXISTS Books
                (
                    book_id     INT AUTO_INCREMENT,
                    user_id     INT NOT NULL,
                    category_id INT NOT NULL,
                    title       VARCHAR(100) NOT NULL,
                    pages       INT,
                    is_read     BOOLEAN DEFAULT FALSE,
                    PRIMARY KEY (book_id),
                    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
                );
            `;

            connection.query(createUsersTableQuery, (err) => {
                if (err) {
                    console.error('Error creating Users table:', err);
                    return;
                }
                console.log('Users table created successfully.');

                connection.query(createCategoriesTableQuery, (err) => {
                    if (err) {
                        console.error('Error creating Categories table:', err);
                        return;
                    }
                    console.log('Categories table created successfully.');

                    connection.query(createBooksTableQuery, (err) => {
                        if (err) {
                            console.error('Error creating Books table:', err);
                        } else {
                            console.log('Books table created successfully.');
                        }
                    });
                });
            });
        });
    });
});

module.exports = connection;
