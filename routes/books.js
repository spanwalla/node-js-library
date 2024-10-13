const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_URL = 'http://localhost:3000/api'

/* GET book list. */
router.get('/', async (req, res) => {
    const response = await axios.get(`${API_URL}/books`);
    const data = response.data;

    res.render('books', {books: data}, (err, html) => {
        if (err) {
            return res.status(500).send(`Error rendering books: ${err.message}`);
        }

        res.render('layout', {
            title: 'LMS',
            customStyles: ['books'],
            customScripts: ['books'],
            body: html
        });
    });
});

router.get('/search', async (req, res) => {
    const response = await axios.get(`${API_URL}/books/search`, {params: req.query});
    const data = response.data;

    res.render('partials/books_card', {books: data});
});

/* GET book details */
router.get('/:bookId([0-9]{1,})', async (req, res) => {
    const response = await axios.get(`${API_URL}/books/${req.params.bookId}`);
    const data = response.data;

    res.render('book', {id: req.params.bookId, book: data}, (err, html) => {
        if (err) {
            return res.status(500).send(`Error rendering books: ${err.message}`);
        }

        res.render('layout', {
            title: 'LMS',
            customStyles: ['book'],
            customScripts: ['book'],
            body: html
        });
    });
});

module.exports = router;
