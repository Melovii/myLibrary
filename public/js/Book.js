// Book class definition
export class Book {
    constructor(title, author, pages, isRead, book_id, category) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = Boolean(isRead);
        this.id = String(book_id); // Ensure ID is always stored as string
        this.category = category;
    }

    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}
