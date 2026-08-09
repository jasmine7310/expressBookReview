const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if (!username || !password){
    return res.status(404).json({message: "Username or password not provided"})
  }

  console.log(users)

  if (isValid(username)){
    return res.status(404).json({message: "Username already exists, please provide another"})
  }

  users.push({'username': username, 'password': password})
  console.log(users)
  return res.status(200).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookStr = JSON.stringify(books);
  return res.status(200).send(bookStr);
});

public_users.get('/promise/books', function (req, res) {
    axios.get(`${BASE_URL}/`)
      .then((response) => {
        return res.status(200).send(response.data);
      })
      .catch((error) => {
        return res.status(500).json({ message: "Error fetching book list", error: error.message });
      });
});

public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn]

  if (book) {
    return res.status(200).send(book);
  } else {
    return res.status(404).json({ message: "Book not found for IBSN" });
  }
});

public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
      .then((response) => {
        return res.status(200).send(response.data);
      })
      .catch((error) => {
        return res.status(404).json({ message: "Book not found for ISBN", error: error.message });
      });
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found for ISBN", error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  const bookKeys = Object.keys(books)
  // need to get multiple books
  let filteredBooks = bookKeys.filter((isbn) => {
    return (books[isbn].author === author)
  })
  // convert isbns into proper arr
  filteredBooks.forEach((isbn, index) => {
    filteredBooks[index] = books[isbn]
  })

  if (filteredBooks){
    return res.status(200).send(filteredBooks);
  } else {
    return res.status(404).json({message : "Books with author not found"})
  }
});

public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`${BASE_URL}/author/${author}`)
      .then((response) => {
        return res.status(200).send(response.data);
      })
      .catch((error) => {
        return res.status(404).json({ message: "Books with author not found", error: error.message });
      });
});

public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`${BASE_URL}/author/${author}`);
      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Books with author not found", error: error.message });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  const bookKeys = Object.keys(books)

  console.log("in title route")
  for (const isbn of bookKeys){
    console.log("in for loop")
    if (books[isbn].title === title){
        console.log("found book")
        console.log(books[isbn])
        return res.status(200).send(books[isbn])
    }
  }

  return res.status(404).json({message: "Book with title not found :C"});
});

public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title/${title}`)
      .then((response) => {
        return res.status(200).send(response.data);
      })
      .catch((error) => {
        return res.status(404).json({ message: "Book with title not found", error: error.message });
      });
});

public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const response = await axios.get(`${BASE_URL}/title/${title}`);
      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book with title not found", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if (isbn){
    return res.status(200).send(books[isbn].reviews)
  } else {
    return res.status(404).json({message: "Book with ISBN not found, reviews not found"});
  }
  
});

module.exports.general = public_users;
