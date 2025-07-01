const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username) => { //returns boolean
	//write code to check is the username is valid
	for (let user in users) {
		if (users[user].username === username) {
			return false;
		}
	}
	return true;
}

const authenticatedUser = (username, password) => { //returns boolean
	//write code to check if username and password match the one we have in records.
	for (let user in users) {
		console.log(users[user]);
		if (users[user].username === username && users[user].password === password) {
			return true;
		}
	}
	return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Check username and password presents or not
	if (!username || !password) {
		return res.status(404).json({ message: "Username or password missing" });
	}

	// Authenticate user
	if (authenticatedUser(username, password)) {
		// Generate JWT access token
		let accessToken = jwt.sign({
			data: password
		}, 'myPrivateKey', { expiresIn: 60 * 60 });
		// Store access token an username in session
		req.session.authorization = {
			accessToken, username
		}
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;
	const review = req.body.review;
	console.log(username);
	console.log(books[isbn]["reviews"]);
	// First, check if book exists
	if (books[isbn]) {
		books[isbn]["reviews"][username.toString()] = review; // This does both adding and updating
		console.log(books[isbn]["reviews"]);
		return res.status(200).send(`Book ${isbn} has been reviewed by ${username} with content: ${review}`);
	}
	return res.status(200).send(`There are no books with ISBN ${isbn}`);
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;
	// First, check if book exists
	if (books[isbn]) {
		// Check if user's review exists
		if (books[isbn]["reviews"][username.toString()]) {
			delete books[isbn]["reviews"][username.toString()];
			console.log(books[isbn]["reviews"]);
			return res.status(200).send(`Book review of ${username} on ${isbn} has been removed`);
		}
		return res.status(200).send(`There are no book review of ${username} on ${isbn}`);
	}
	return res.status(200).send(`There are no books with ISBN ${isbn}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
