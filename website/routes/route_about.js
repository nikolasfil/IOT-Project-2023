const express = require('express');
const router = express.Router();

router.get('/about',
    (req, res) => {
        res.render('about', {
            title: 'About us',
            style: 'about.css',
            signedIn: req.session.signedIn
        });
    });

router.get('/contact', (req, res) => {
    res.redirect('/about');
});


module.exports = router;


