const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookStr = JSON.stringify(books);
  return res.status(200).send(bookStr);
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
  return res.status(200).send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
