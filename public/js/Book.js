export class Book {
    constructor(title, author, pages, isRead, book_id) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = Boolean(isRead);
        this.id = String(book_id);
    }

    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}
