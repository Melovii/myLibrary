const popupButton = document.querySelector('#add-book');
const closeButton = document.querySelector('.close-btn');
const submitBook = document.querySelector('.form-element button');

const library = new Library();

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
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const isRead = document.getElementById('read-check');
    event.preventDefault();

    if (!title || !author || !pages || pages <= 0) {
        alert('Please fill in all fields with valid data.');
        return;
    }

    library.addBook(title, author, pages, isRead);

    document.querySelector('.popup').classList.remove('active');
    document.querySelector('.center').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    toggleReadStatus(){
        this.isRead = !this.isRead;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(title, author, pages, isRead) {
        let newBook = new Book(title.trim(), author.trim(), pages.trim(), isRead.checked);
        this.addCard(title, author, pages, isRead, newBook);
        this.books.push(newBook);
    }

    addCard(title, author, pages, isRead, newBook) {
        const main = document.querySelector('main');
        const cardDIV = document.createElement('div');
        cardDIV.classList.add('card');
        const titlePara = document.createElement('p');
        titlePara.classList.add('title');
        titlePara.textContent = `"${title}"`;
        const authorPara = document.createElement('p');
        authorPara.classList.add('author');
        authorPara.textContent = author;
        const pagesPara = document.createElement('p');
        pagesPara.classList.add('pages');
        pagesPara.textContent = `${pages} pages`;
        const isReadButton = document.createElement('button');

        if (isRead.checked) {
            isReadButton.classList.add('read');
            isReadButton.textContent = 'Read';
        } else {
            isReadButton.classList.add('not-read');
            isReadButton.textContent = 'Not Read';
        }

        isReadButton.addEventListener('click', () => {
            newBook.toggleReadStatus();
            if (newBook.isRead) {
                this.updateReadStatus(isReadButton, newBook);
            } else {
                this.updateReadStatus(isReadButton, newBook);
            }
        })

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            const index = this.books.indexOf(newBook);
            if (index !== -1) {
                this.books.splice(index, 1);
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

    updateReadStatus(button, book) {
        if (button.textContent === 'Read') {
            button.textContent = 'Not Read';
            button.classList.toggle('not-read');
            button.classList.toggle('read');
            book.isRead = false;
        } else {
            button.textContent = 'Read';
            button.classList.toggle('read');
            button.classList.toggle('not-read');
            book.isRead = true;
        }
    }
}