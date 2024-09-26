const express = require('express');
const router = express.Router();

/* GET books listing. */
router.get('/books', (req, res, next) => {
    res.json({status: 'success'});
});

module.exports = router;
