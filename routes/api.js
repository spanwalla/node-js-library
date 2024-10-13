const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.get('/books', bookController.getAllBooks);
router.get('/books/:bookId([0-9]{1,})', bookController.getBook);
router.get('/books/search', bookController.searchBooks);
router.post('/books', bookController.createBook);
router.patch('/books/:bookId([0-9]{1,})', bookController.editBook);
router.delete('/books/:bookId([0-9]{1,})', bookController.deleteBook);

module.exports = router;
