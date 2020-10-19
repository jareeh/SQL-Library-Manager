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


/* Create NEW book form */
router.get('/new', (req, res) => {
  res.render('new-book', { book: {} });
});


/* POST create book */
router.post('/new', asyncHandler(async (req, res) => {
  console.log(req.body)
  const book = await Book.create(req.body);
  res.redirect('/books');
  // let book;
  // try {
  //   book = await Book.create(req.body);
  //   res.redirect('/books);
  // } catch (error) {
  //   if (error.name === "SequelizeValidationError") {
  //     article = await Article.build(req.body);
  //     res.render('books/new', { books, errors: error.errors})
  //   } else {
  //     throw error;
  //   }
  // }
}));


/* Shows book detail form, individual listing */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book });
  } else {
    res.sendStatus(404);
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