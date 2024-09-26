const express = require('express');
const router = express.Router();

/* GET book list. */
router.get('/', (req, res) => {
    res.render('books', {}, (err, html) => {
        if (err) {
            return res.status(500).send("Error rendering books");
        }

        res.render('layout', {
            title: 'LMS',
            customStyles: ['books'],
            body: html
        });
    });
});

/* GET book details */
router.get('/:bookId', (req, res) => {
    res.render('book', {}, (err, html) => {
        if (err) {
            return res.status(500).send("Error rendering book");
        }

        res.render('layout', {
            title: 'LMS',
            customStyles: ['book'],
            body: html
        });
    });
});

module.exports = router;
