class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(title, author, pages, isRead) {
        const newBook = new Book(title.trim(), author.trim(), pages.trim(), isRead.checked);
        this.books.push(newBook);
        this.addCard(newBook.title, newBook.author, newBook.pages, isRead, newBook);
        this.saveToStorage();
    }

    addCard(title, author, pages, isRead, newBook) {
        const main = document.querySelector('main');
        const cardDIV = document.createElement('div');
        cardDIV.classList.add('card');

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
        isReadButton.classList.add(newBook.isRead ? 'read' : 'not-read');
        isReadButton.textContent = newBook.isRead ? 'Read' : 'Not Read';

        isReadButton.addEventListener('click', () => {
            newBook.toggleReadStatus();
            this.updateReadStatus(isReadButton, newBook.isRead);
            this.saveToStorage();
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';

        removeButton.addEventListener('click', () => {
            const index = this.books.indexOf(newBook);
            if (index !== -1) {
                this.books.splice(index, 1);
                this.saveToStorage();
            }
            cardDIV.remove();
        });

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

    updateReadStatus(button, isRead) {
        button.textContent = isRead ? 'Read' : 'Not Read';
        button.classList.toggle('read', isRead);
        button.classList.toggle('not-read', !isRead);
    }

    saveToStorage() {
        localStorage.setItem('library', JSON.stringify(this.books));
    }

    loadFromStorage() {
        const data = JSON.parse(localStorage.getItem('library'));
        if (data) {
            data.forEach(bookObj => {
                const newBook = new Book(bookObj.title, bookObj.author, bookObj.pages, bookObj.isRead);
                this.books.push(newBook);
                this.addCard(newBook.title, newBook.author, newBook.pages, { checked: newBook.isRead }, newBook);
            });
        }
    }
}

// Global instance
const library = new Library();
library.loadFromStorage();

// Popup form logic
const popupButton = document.querySelector('#add-book');
const closeButton = document.querySelector('.close-btn');
const submitBook = document.querySelector('.form-element button');
const form = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');

popupButton.addEventListener('click', () => {
    document.querySelector('.popup').classList.add('active');
    document.querySelector('.center').classList.add('active');
    document.body.classList.add('no-scroll');
});

closeButton.addEventListener('click', () => {
    document.querySelector('.popup').classList.remove('active');
    document.querySelector('.center').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

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

        document.querySelector('.popup').classList.remove('active');
        document.querySelector('.center').classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
