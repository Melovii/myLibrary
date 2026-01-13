import { Book } from './Book.js';

// Library class definition
export class Library {
    constructor() {
        this.books = [];
    }

    // Fetch all books from the database
    async loadFromDB() {
        try {
            const response = await fetch('/books');
            if (!response.ok) {
                console.error('Failed to load books: Not logged in or server error');
                return;
            }

            const data = await response.json();
            data.forEach(bookOBJ => {
                const newBook = new Book(
                    bookOBJ.title,
                    bookOBJ.author,
                    bookOBJ.pages,
                    bookOBJ.is_read,
                    bookOBJ.book_id,
                    bookOBJ.category_name
                );
                this.books.push(newBook);
                this.addCard(
                    newBook.title,
                    newBook.author,
                    newBook.pages,
                    { checked: newBook.isRead },
                    newBook
                );
            });

            console.log('Books loaded from database:', this.books);
            this.toggleEmptyLibraryMessage();
        } catch (error) {
            console.error('Error loading books from DB:', error);
        }
    }


    // Fetch and display all books from the database for debugging
    async displayBooksFromDB() {
        const response = await fetch('/books');
        if (response.ok) {
            const books = await response.json();
            console.log('Current books in the database:', books);
        } else {
            console.error('Error fetching books for debugging');
        }
    }

    // Add a new book to the database
    async addBook(title, author, pages, isRead, categoryName) {
        const newBook = new Book(title.trim(), author.trim(), pages.trim(), isRead, null, categoryName);

		// TODO: CHANGE USER_ID LATER :SOB:
        const response = await fetch('/addBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newBook.title,
                author: newBook.author,
                pages: newBook.pages,
                isRead: newBook.isRead,
                categoryName: categoryName // send the name instead of number
            })
        });

        if (response.ok) {
            const data = await response.json();
            newBook.id = String(data.bookId); // Set the ID from database response
          
            this.books.push(newBook);
            this.addCard(newBook.title, newBook.author, newBook.pages, isRead, newBook);
            this.toggleEmptyLibraryMessage();
        } else {
            console.error('Error adding book');
        }
    }
  
    // location.reload();


    // Remove a book from the database
    async removeBook(bookID, cardDIV) {
        const response = await fetch('/removeBook', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookID: String(bookID) }) // Ensure ID is string
        });

        if (response.ok) {
            console.log('Book removed successfully');
            const index = this.books.findIndex(book => book.id === String(bookID));
            if (index !== -1) {
                this.books.splice(index, 1);
            }
            cardDIV.remove();
            this.toggleEmptyLibraryMessage();
            library.displayBooksFromDB(); // ! could be this. instead !
        } else {
            console.error('Error removing book');
        }
    }

    // Update the read status of a book in the database
    async updateReadStatus(bookID) {
        // Convert bookID to string to ensure consistency
        const stringBookID = String(bookID);
        
        // Find the book in our local array
        const book = this.books.find(book => book.id === stringBookID);
        if (!book) {
            console.error('Book not found:', stringBookID);
            return;
        }

        // Toggle the read status
        book.toggleReadStatus();

        // Update the button
        const button = document.querySelector(`#book-${stringBookID} .read-status`);
        if (!button) {
            console.error('Button not found for book ID:', stringBookID);
            return;
        }

        button.textContent = book.isRead ? 'Read' : 'Not Read';
        button.classList.toggle('read', book.isRead);
        button.classList.toggle('not-read', !book.isRead);

        // Send update to server
        const response = await fetch('/updateReadStatus', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                bookID: stringBookID,
                isRead: book.isRead 
            })
        });

		// Revert if the update failed
        if (!response.ok) {
            console.error('Error updating read status');
            book.toggleReadStatus();
            button.textContent = book.isRead ? 'Read' : 'Not Read';
            button.classList.toggle('read', book.isRead);
            button.classList.toggle('not-read', !book.isRead);
        }
    }

    // Add a card to the library display
    addCard(title, author, pages, isRead, newBook) {
        const main = document.querySelector('main');
        const cardDIV = document.createElement('div');
        cardDIV.classList.add('card');
        cardDIV.id = `book-${newBook.id}`; // ID is already string from Book constructor

        const titlePara = document.createElement('p');
        titlePara.classList.add('title');
        titlePara.textContent = title;

        const authorPara = document.createElement('p');
        authorPara.classList.add('author');
        authorPara.textContent = author;

        const categoryPara = document.createElement('p');
        categoryPara.classList.add('category');

        // Emoji mapping
        const emojiMap = {
            "Biography": "🧑‍🏫",
            "Educational": "📘",
            "Fantasy": "🧙",
            "Fiction": "📖",
            "Horror": "👻",
            "Mystery": "🕵️",
            "Religious": "🙏",
            "Romance": "💖",
            "Sci-Fi": "🚀",
            "Self-Improvement": "💡",
            "Other": "📚"
        };

        const emoji = emojiMap[newBook.category] || "📚";
        categoryPara.textContent = `${emoji} ${newBook.category}`;

        const pagesPara = document.createElement('p');
        pagesPara.classList.add('pages');
        pagesPara.textContent = `${pages} pages`;

        const isReadButton = document.createElement('button');
        isReadButton.classList.add('read-status', newBook.isRead ? 'read' : 'not-read');
        isReadButton.textContent = newBook.isRead ? 'Read' : 'Not Read';

        isReadButton.addEventListener('click', () => {
            this.updateReadStatus(newBook.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';

        removeButton.addEventListener('click', () => {
            this.removeBook(newBook.id, cardDIV);
        });

        this.emptyInput();
        cardDIV.append(titlePara, authorPara, categoryPara, pagesPara, isReadButton, removeButton);
        main.appendChild(cardDIV);
    }

    // Clear the input fields after submitting a book
    emptyInput() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('pages').value = '';
        document.getElementById('read-check').checked = false;
    }

    toggleEmptyLibraryMessage() {
        const emptyMessage = document.getElementById('empty-library-message');
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    }

}
