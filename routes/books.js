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


/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books , title: "SQL Library Manager"});
}));


/* Create NEW article form */
router.get('/new', (req, res) => {
  res.render('new-book', { book: {}, title: "New Book" });
});


/* POST create book */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      article = await Article.build(req.body);
      res.render('books/new', { books, errors: error.errors, title: "New Article" })
    } else {
      throw error;
    }
  }
}));


/* Shows book detail form, individual listing */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('/update-book', { book, title: 'Edit book' });
  } else {
    res.sendStatus(404);
  }
}));


/* update book */
router.post('/:id', asyncHandler(async (res, req) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/' + book.id)
}));


/* DELETE A BOOK */ 
router.get('/:id/delete', asyncHandler(async (res, req) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/');
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;