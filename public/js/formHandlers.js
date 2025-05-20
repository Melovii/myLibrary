// Form handling and popup logic
export function setupFormHandlers(library) {
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
          
			// TODO: CHANGE IT LATER :SOB:
			const userId = 1; // Assuming userId is 1 for now, you can change this as needed
            library.addBook(title, author, pages, isRead, userId);
            document.querySelector('.popup').classList.remove('active');
            document.querySelector('.center').classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}
