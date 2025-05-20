const MySQL = require('mysql2');
require('dotenv').config();

const connection = MySQL.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
});

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to the database:', err.stack);
		return;
	}
	console.log('Connected to MySQL as id ' + connection.threadId);

	// TODO: Create categories table later
	// Create a database if it doesn't exist
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
			
			const createUsersTableQuery = `
				CREATE TABLE IF NOT EXISTS Users
				(
					user_id     INT AUTO_INCREMENT,
					username    VARCHAR(69),
					pass_hash   VARCHAR(255),
					created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					PRIMARY KEY (user_id)
				);
			`;

			const createBooksTableQuery = `
				CREATE TABLE IF NOT EXISTS Books
				(
					book_id     INT AUTO_INCREMENT,
					user_id     INT NOT NULL,
					title       VARCHAR(50),
					author      VARCHAR(50),
					pages       INT,
					is_read     BOOLEAN DEFAULT FALSE,
					PRIMARY KEY (book_id),
					FOREIGN KEY (user_id) REFERENCES Users(user_id)
				);
			`;

			const createCategoriesTableQuery = `
				CREATE TABLE IF NOT EXISTS Categories (
					category_id INT AUTO_INCREMENT,
					name        VARCHAR(50) UNIQUE,
					PRIMARY KEY (category_id)
				);
			`;

			const createBookCategoriesTableQuery = `
				CREATE TABLE IF NOT EXISTS BookCategories (
					book_id     INT,
					category_id INT,
					PRIMARY KEY (book_id, category_id),
					FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE,
					FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
				);
			`;

			connection.query(createUsersTableQuery, (err) => {
				if (err) {
					console.error('Error creating Users table:', err);
				} else {
					console.log('Users table created successfully.');
				}

				connection.query(createBooksTableQuery, (err) => {
					if (err) {
						console.error('Error creating Books table:', err);
					} else {
						console.log('Books table created successfully.');
					}

					connection.query(createCategoriesTableQuery, (err) => {
						if (err) {
							console.error('Error creating Categories table:', err);
						} else {
							console.log('Categories table created successfully.');

							// Insert fixed categories if they don't already exist
							const predefinedCategories = [
								'Biography', 'Educational', 'Fantasy',
								'Fiction', 'Horror', 'Mystery',
								'Religious', 'Romance', 'Sci-Fi', 'Self-Improvement', 'Other'
							];

							const insertCategoriesQuery = `
								INSERT IGNORE INTO Categories (name)
								VALUES ?;
							`;

							const categoryValues = predefinedCategories.map(name => [name]);

							connection.query(insertCategoriesQuery, [categoryValues], (err) => {
								if (err) {
									console.error('Error inserting categories:', err);
								} else {
									console.log('Predefined categories inserted successfully.');
								}
							});
						}

						connection.query(createBookCategoriesTableQuery, (err) => {
							if (err) {
								console.error('Error creating BookCategories table:', err);
							} else {
								console.log('BookCategories table created successfully.');
							}
						});
					});
				});
			});
		});
	});
});

module.exports = connection;
