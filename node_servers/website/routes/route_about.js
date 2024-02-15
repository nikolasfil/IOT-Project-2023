const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authentication.js');

router.get('/about',
    (req, res, next) => {
        if (req.session.signedIn) {
            req.session.alert_message = "Button 75, assigned to user 5 has issued a panic alert. Mount immediate rescue operation at the following coordinates: 37.7749° N, 122.4194° W."
        }
        next();
    },
    authentication.alerting,
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


