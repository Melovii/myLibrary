import { Book } from './Book.js';

export class Library {
    constructor() {
        this.books = [];
    }

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

    async displayBooksFromDB() {
        const response = await fetch('/books');
        if (response.ok) {
            const books = await response.json();
            console.log('Current books in the database:', books);
        } else {
            console.error('Error fetching books for debugging');
        }
    }

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
            newBook.id = String(data.bookId);
            this.books.push(newBook);
            this.addCard(newBook.title, newBook.author, newBook.pages, isRead, newBook);
        } else {
            console.error('Error adding book');
        }

        location.reload();
    }

    async removeBook(bookID, cardDIV) {
        const response = await fetch('/removeBook', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookID: String(bookID) })
        });

        if (response.ok) {
            console.log('Book removed successfully');
            const index = this.books.findIndex(book => book.id === String(bookID));
            if (index !== -1) this.books.splice(index, 1);
            cardDIV.remove();
            this.displayBooksFromDB();
        } else {
            console.error('Error removing book');
        }
    }

    async updateReadStatus(bookID) {
        const stringBookID = String(bookID);
        const book = this.books.find(book => book.id === stringBookID);
        if (!book) return console.error('Book not found:', stringBookID);

        book.toggleReadStatus();

        const button = document.querySelector(`#book-${stringBookID} .read-status`);
        if (!button) return console.error('Button not found for book ID:', stringBookID);

        button.textContent = book.isRead ? 'Read' : 'Not Read';
        button.classList.toggle('read', book.isRead);
        button.classList.toggle('not-read', !book.isRead);

        const response = await fetch('/updateReadStatus', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookID: stringBookID, isRead: book.isRead })
        });

        if (!response.ok) {
            console.error('Error updating read status');
            book.toggleReadStatus();
            button.textContent = book.isRead ? 'Read' : 'Not Read';
            button.classList.toggle('read', book.isRead);
            button.classList.toggle('not-read', !book.isRead);
        }
    }

    addCard(title, author, pages, isRead, newBook) {
        const main = document.querySelector('main');
        const cardDIV = document.createElement('div');
        cardDIV.classList.add('card');
        cardDIV.id = `book-${newBook.id}`;

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
        isReadButton.addEventListener('click', () => this.updateReadStatus(newBook.id));

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => this.removeBook(newBook.id, cardDIV));

        this.emptyInput();
        cardDIV.append(titlePara, authorPara, pagesPara, isReadButton, removeButton);
        main.appendChild(cardDIV);
    }

    emptyInput() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('pages').value = '';
        document.getElementById('read-check').checked = false;
    }
}
