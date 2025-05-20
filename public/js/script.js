// Book class definition
class Book {
    constructor(title, author, pages, isRead, book_id) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = Boolean(isRead);
        this.id = String(book_id); // Ensure ID is always stored as string
    }

    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}

// Library class definition
class Library {
    constructor() {
        this.books = [];
    }

    // Fetch all books from the database
    async loadFromDB() {
        const response = await fetch('/books');
        const data = await response.json();
        data.forEach(bookOBJ => {
            const newBook = new Book(
                bookOBJ.title,
                bookOBJ.author,
                bookOBJ.pages,
                bookOBJ.is_read,
                bookOBJ.book_id
            );
            this.books.push(newBook);
            this.addCard(newBook.title, newBook.author, newBook.pages, { checked: newBook.isRead }, newBook);
        });
        console.log('Books loaded from database:', this.books);
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
    async addBook(title, author, pages, isRead) {
        const newBook = new Book(title.trim(), author.trim(), pages.trim(), isRead.checked);

        const response = await fetch('/addBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newBook.title,
                author: newBook.author,
                pages: newBook.pages,
                isRead: newBook.isRead
            })
        });

        if (response.ok) {
            const data = await response.json();
            newBook.id = String(data.bookId); // Set the ID from database response
            this.books.push(newBook);
            this.addCard(newBook.title, newBook.author, newBook.pages, isRead, newBook);
        } else {
            console.error('Error adding book');
        }

        location.reload();
    }

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
            library.displayBooksFromDB();
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

        // Update button appearance
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

        if (!response.ok) {
            console.error('Error updating read status');
            // Revert if the update failed
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

        const pagesPara = document.createElement('p');
        pagesPara.classList.add('pages');
        pagesPara.textContent = `${pages} pages`;

        const isReadButton = document.createElement('button');
        isReadButton.classList.add('read-status', newBook.isRead ? 'read' : 'not-read');
        isReadButton.textContent = newBook.isRead ? 'Read' : 'Not Read';

        isReadButton.addEventListener('click', () => {
            library.updateReadStatus(newBook.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';

        removeButton.addEventListener('click', () => {
            library.removeBook(newBook.id, cardDIV);
        });

        this.emptyInput();
        cardDIV.append(titlePara, authorPara, pagesPara, isReadButton, removeButton);
        main.appendChild(cardDIV);
    }

    // Clear the input fields after submitting a book
    emptyInput() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('pages').value = '';
        document.getElementById('read-check').checked = false;
    }
}

// Global library instance
const library = new Library();
window.addEventListener('load', () => {
    library.loadFromDB();
});

// Popup form logic
const popupButton = document.querySelector('#add-book');
const closeButton = document.querySelector('.close-btn');
const submitBook = document.querySelector('.form-element button');
const form = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');

// Open popup form
popupButton.addEventListener('click', () => {
    // Use the correct selector for the add book popup
    document.querySelector('.popup').classList.add('active');
    document.querySelector('.center').classList.add('active');
    document.body.classList.add('no-scroll');
    // Hide register and login popups if present
    const registerPopup = document.querySelector('.registerPopup');
    const loginPopup = document.querySelector('.loginPopup');
    if (registerPopup) registerPopup.classList.remove('active');
    if (loginPopup) loginPopup.classList.remove('active');
});

// Close popup form
closeButton.addEventListener('click', () => {
    document.querySelector('.popup').classList.remove('active');
    document.querySelector('.center').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Submit book to library
submitBook.addEventListener('click', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.reportValidity();
    } else {
        const title = titleInput.value;
        const author = authorInput.value;
        const pages = pagesInput.value;
        const isRead = document.getElementById('read-check');

        library.addBook(title, author, pages, isRead);

        // Close the popup after submission
        document.querySelector('.popup').classList.remove('active');
        document.querySelector('.center').classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
