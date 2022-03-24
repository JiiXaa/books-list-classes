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

  saveData() {
    storage.saveItemsLS(this.books);
  }
}

const booksList = new BooksList();

class Ui {
  addBookToTable(book) {
    const tbody = document.querySelector('#booksTable tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td></td>
    `;

    tbody.appendChild(tr);
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
