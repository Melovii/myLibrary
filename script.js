const myLibrary = [];

function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
}

function addBook() {
    let title = prompt('Enter book title:');
    let author = prompt('Enter book author:');
    let pages = prompt('Enter book pages:');

    let newBook = new Book(title.trim(), author.trim(), pages.trim());

    myLibrary.push(newBook);
}

function displayBooks() {
    if (myLibrary.length === 0) {
        console.log("No books in the library yet.");
    } else {
        myLibrary.forEach(book => {
            console.log(`${book.title} by ${book.author} is ${book.pages} pages!`);
        });
    }
}

addBook();
displayBooks();