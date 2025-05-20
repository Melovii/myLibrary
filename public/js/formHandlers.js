// Form handling and popup logic
export function setupFormHandlers(library) {
    const popupButton = document.querySelector('#add-book');
    const closeButton = document.querySelector('.close-btn');
    const submitBook = document.querySelector('.form-element button');
    const form = document.getElementById('book-form');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const pagesInput = document.getElementById('pages');
    const categorySelect = document.getElementById('category');
    const categoryError = document.getElementById('category-error');
    const isRead = document.getElementById('read-check');

    function resetForm() {
        form.reset();
        categorySelect.selectedIndex = 0;
        categoryError.textContent = '';
        titleInput.classList.remove('error');
        authorInput.classList.remove('error');
        pagesInput.classList.remove('error');
        categorySelect.classList.remove('error');
    }

    popupButton.addEventListener('click', () => {
        document.querySelector('.popup').classList.add('active');
        document.querySelector('.center').classList.add('active');
        document.body.classList.add('no-scroll');
    });

    closeButton.addEventListener('click', () => {
        document.querySelector('.popup').classList.remove('active');
        document.querySelector('.center').classList.remove('active');
        document.body.classList.remove('no-scroll');
        resetForm(); // 🔁 Reset form on close
    });

    submitBook.addEventListener('click', (event) => {
        event.preventDefault();

        // Reset previous errors
        categoryError.textContent = '';
        categorySelect.classList.remove('error');

        let valid = form.checkValidity();

        // Additional check for category
        if (!categorySelect.value) {
            valid = false;
            categoryError.textContent = 'Please select a category.';
            categorySelect.classList.add('error');
        }

        if (!valid) {
            form.reportValidity();
            return;
        }

        const title = titleInput.value;
        const author = authorInput.value;
        const pages = pagesInput.value;
        const category = categorySelect.value;

        // Pass category to library method too (update your `addBook()` if needed)
        library.addBook(title, author, pages, isRead.checked, category);

        // Close popup and reset form
        document.querySelector('.popup').classList.remove('active');
        document.querySelector('.center').classList.remove('active');
        document.body.classList.remove('no-scroll');
        resetForm();
    });
}
