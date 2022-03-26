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
    console.log('saved');
    e.preventDefault();

    const author = document.getElementById('bookAuthor').value;
    const title = document.getElementById('bookTitle').value;

    if (author === '' || title === '') {
      alert('fill empty fields');
      return;
    }

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
    </td>
    `;

    tbody.appendChild(tr);

    let deleteButton = document.querySelector(
      `button.delete[data-book-id="${book.id}"]`
    );
    deleteButton.addEventListener('click', (e) => this.deleteBook(e));

    this.clearInputs();
  }

  clearInputs() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
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
