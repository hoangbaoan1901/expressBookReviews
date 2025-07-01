const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;



public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!(username && password)) {
		return res.status(404).json({ message: "Username or password missing" });
	}

	if (isValid(username)) {
		users.push({ "username": username, "password": password });
		console.log(users);
		return res.status(200).json({ message: `User ${username} registered successfully` });
	} else {
		return res.status(404).json({ message: `Username ${username} has already been registered` });
	}
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const isbn = req.params.isbn
	const filteredBooks = books[isbn];
	if (filteredBooks) {
		return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
	} else {
		return res.status(200).send(`There are no books with ISBN ${isbn}`);
	}
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	let i = 1;
	let filteredBooks = [];
	const author = req.params.author;
	while (books[i]) {
		if (books[i].author === author) {
			filteredBooks.push(books[i]);
		}
		i += 1;
	}
	if (filteredBooks.length > 0) {
		return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
	} else {
		return res.status(200).send(`There are no books with author ${author}`);
	}
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	let i = 1;
	let filteredBooks = [];
	const title = req.params.title;
	while (books[i]) {
		if (books[i].title === title) {
			filteredBooks.push(books[i]);
		}
		i += 1;
	}
	if (filteredBooks.length > 0) {
		return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
	} else {
		return res.status(200).send(`There are no books with title ${title}`);
	}
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn
	const filteredBooks = books[isbn].reviews;
	if (filteredBooks) {
		return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
	} else {
		return res.status(200).send(`There are no books with ISBN ${isbn}`);
	}
});


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


module.exports.general = public_users;
