const axios = require('axios').default;

const URL = "http://localhost:5000";

function printData(data) {
    console.log(data);
}

async function getBooks() {
    books = await axios.get(URL + "/");
    console.log(books.data);
}


async function getBooksOnISBN(isbn) {
    isbnURL = `/isbn/${isbn}`;
    books = await axios.get(URL + isbnURL);
    console.log(books.data);
}


async function getBooksOnAuthor(author) {
    isbnURL = `/author/${author}`;
    books = await axios.get(URL + isbnURL);
    console.log(books.data);
}

async function getBooksOnTitle(title) {
    isbnURL = `/title/${title}`;
    books = await axios.get(URL + isbnURL);
    console.log(books.data);
}

getBooks();
getBooksOnAuthor("Unknown");
