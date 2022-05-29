window.onload = function () {
  console.log('App has started!');
  booksList.init();
};

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.id = Date.now();
  }
}

class BooksList {
  constructor() {
    this.books = [];
  }

  init() {
    document
      .getElementById('saveButton')
      .addEventListener('click', (e) => this.saveButton(e));
    // init is invoked onload so it will render books from LS if there is one
    this.loadDataFromLS();
  }

  loadDataFromLS() {
    const data = storage.getItemsLS();
    if (data == null || data == undefined) return;

    this.books = data;

    data.forEach((dataValue, i) => {
      ui.addBookToTable(dataValue);
    });
  }

  saveButton(e) {
    console.log('Book has been saved.');

    const author = document.getElementById('bookAuthor').value;
    const title = document.getElementById('bookTitle').value;

    if (author === '' || title === '') {
      console.log('fill empty form fields');
      return;
    }

    e.preventDefault();

    const book = new Book(title, author);
    this.addBook(book);
  }

  addBook(book) {
    this.books.push(book);
    ui.addBookToTable(book);
    this.saveData();
  }

  removeBookByIdfromLS(bookId) {
    this.books.forEach((el, i) => {
      console.log(el);
      if (el.id == bookId) this.books.splice(i, 1);
    });

    this.saveData();
  }

  saveData() {
    storage.saveItemsLS(this.books);
  }

  moveBookUp(bookId) {
    const booksArr = this.books;

    for (let i = 0; i < booksArr.length; i++) {
      const element = booksArr[i];

      if (element.id == bookId) {
        if (i >= 1) {
          let temp = booksArr[i - 1];
          booksArr[i - 1] = booksArr[i];
          booksArr[i] = temp;
          break;
        }
      }
    }

    this.saveData();
    ui.deleteAllBookRows();
    this.loadDataFromLS();
  }

  moveBookDown(bookId) {
    const booksArr = this.books;

    for (let i = 0; i < booksArr.length; i++) {
      const element = booksArr[i];

      if (element.id == bookId) {
        if (i <= booksArr.length - 2) {
          let temp = booksArr[i + 1];
          booksArr[i + 1] = booksArr[i];
          booksArr[i] = temp;
          break;
        }
      }
    }

    this.saveData();
    ui.deleteAllBookRows();
    this.loadDataFromLS();
  }
}

const booksList = new BooksList();

class Ui {
  deleteBook(e) {
    const bookId = e.target.getAttribute('data-book-id');
    e.target.parentElement.parentElement.remove();
    booksList.removeBookByIdfromLS(bookId);
  }

  addBookToTable(book) {
    const tbody = document.querySelector('#booksTable tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>
      <button type="button" data-book-id="${book.id}" class="btn btn-danger btn-sm delete">Delete</button>
      <button type="button" data-book-id="${book.id}" class="btn btn-secondary btn-sm up-arrow">▲</button>
      <button type="button" data-book-id="${book.id}" class="btn btn-secondary btn-sm down-arrow">▼</button>
    </td>
    `;

    tbody.appendChild(tr);

    let deleteButton = document.querySelector(
      `button.delete[data-book-id="${book.id}"]`
    );
    deleteButton.addEventListener('click', (e) => this.deleteBook(e));

    let upButton = document.querySelector(
      `button.up-arrow[data-book-id="${book.id}"]`
    );
    upButton.addEventListener('click', (e) => this.arrowUp(e));

    let downButton = document.querySelector(
      `button.down-arrow[data-book-id="${book.id}"]`
    );
    downButton.addEventListener('click', (e) => this.arrowDown(e));

    this.clearInputs();
  }

  deleteAllBookRows() {
    const tbodyRows = document.querySelectorAll('#booksTable tbody tr');

    tbodyRows.forEach((el) => el.remove());
  }

  arrowUp(e) {
    const bookId = e.target.getAttribute('data-book-id');
    console.log('up', bookId);
    booksList.moveBookUp(bookId);
  }

  arrowDown(e) {
    const bookId = e.target.getAttribute('data-book-id');
    console.log('down', bookId);
    booksList.moveBookDown(bookId);
  }

  clearInputs() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';

    document.getElementById('bookForm').classList.remove('was-validated');
  }
}

const ui = new Ui();

class Storage {
  getItemsLS() {
    let books = null;

    if (localStorage.getItem('books') !== null) {
      books = JSON.parse(localStorage.getItem('books'));
    } else {
      books = [];
    }

    return books;
  }

  saveItemsLS(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

const storage = new Storage();

// Bootstraps forms validator
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();
