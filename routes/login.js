const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('login', {}, (err, html) => {
        if (err) {
            return res.status(500).send("Error rendering login");
        }

        res.render('layout', {
            title: 'LMS | Login',
            customStyles: ['login'],
            customScripts: ['login'],
            body: html
        });
    });
});

module.exports = router;
