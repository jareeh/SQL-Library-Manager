var express = require('express');
// const { EmptyResultError } = require('sequelize/types');
var router = express.Router();

const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}
let results;
function bookSearch(input, books){
  results = [];
  for (let i = 0; i< books.length;i++){
    if (books[i].dataValues.title.toLowerCase().includes(String(input).toLowerCase())) {
      results.push(books[i]);
    } else if (books[i].dataValues.author.toLowerCase().includes(String(input).toLowerCase())) {
      results.push(books[i])
    } else if (books[i].dataValues.genre.toLowerCase().includes(String(input).toLowerCase())) {
      results.push(books[i]);
    } else if (String(books[i].dataValues.year).includes(String(input).toLowerCase())) {
      results.push(books[i])
    }
  }
  // res.render('index', { books: results })
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books , title: "SQL Library Manager"});
}));


/* Create NEW book form */
router.get('/new', (req, res) => {
  res.render('new-book', { book: {} });
});

/* POST Search route */
router.post('/search', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  console.log(req.body.search);
  bookSearch(req.body.search, books);
  console.log(results);
  res.render('index', { books: results });
}))

/* POST create new book */
router.post('/new', asyncHandler(async (req, res) => {
  console.log(req.body)
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      article = await Book.build(req.body);
      res.render('form-error', { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));


/* Shows book detail form, individual listing */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book });
  } else {
    // res.sendStatus(404);
    const err = new Error();
    err.status = 404;
    err.message = 'The book you requested doesn\'t exist';
    next(err);
  }
}));


/* update book */
router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  await book.update(req.body);
  res.redirect('/')
}));


/* DELETE A BOOK */ 
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;