import { Library } from './Library.js';
import { setupFormHandlers } from './formHandlers.js';

const library = new Library();

window.addEventListener('load', () => {
    library.loadFromDB();
    setupFormHandlers(library);
});
