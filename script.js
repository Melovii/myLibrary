const popupButton = document.querySelector('#add-book');
const closeButton = document.querySelector('.close-btn');
const submitBook = document.querySelector('.form-element button');

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
    title = document.getElementById('title').value;
    author = document.getElementById('author').value;
    pages = document.getElementById('pages').value;
    isRead = document.getElementById('read-check');
    event.preventDefault();

    if (title.trim() === '' || author.trim() === '' || pages.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (pages.trim() <= 0) {
        alert('Please enter a valid number of pages.');
        return;
    }

    addBook(title, author, pages, isRead);

    document.querySelector('.popup').classList.remove('active');
    document.querySelector('.center').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

const myLibrary = [];

function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.toggleReadStatus = () => {
        this.isRead = !this.isRead;
    }
}

function addBook(title, author, pages, isRead) {
    let newBook = new Book(title.trim(), author.trim(), pages.trim());
    addCard(title, author, pages, isRead, newBook);
    myLibrary.push(newBook);
}

function addCard(title, author, pages, isRead, book) {
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
    pagesPara.textContent = pages;
    const isReadButton = document.createElement('button');
    if (isRead.checked) {
        isReadButton.classList.add('read');
        isReadButton.textContent = 'Read';
        book.isRead = true;
    } else {
        isReadButton.classList.add('not-read');
        isReadButton.textContent = 'Not Read';
        book.isRead = false;
    }
    isReadButton.addEventListener('click', () => {
        // updateReadStatus(isReadButton);
        book.toggleReadStatus();
        if (book.isRead) {
            updateReadStatus(isReadButton, book);
        }
    })
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = 'Remove';

    emptyInput();

    // CHECK REMOVE BUTTON LATER AHA

    cardDIV.append(titlePara, authorPara, pagesPara, isReadButton, removeButton);
    main.appendChild(cardDIV);
}

function emptyInput() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('pages').value = '';
    document.getElementById('read-check').checked = false;
}


function updateReadStatus(button, book) {
    if (button.textContent === 'Read') {
        button.textContent = 'Not Read';
        button.classList.toggle('not-read');
        button.classList.toggle('read');
        book.isRead = false;
    } else {
        button.textContent = 'Read';
        button.classList.toggle('read');
        button.classList.toggle('not-read');
        book.isRead = false;
    }
}
// TODO: FUNCTION TO REMOVE CARD FROM DOM