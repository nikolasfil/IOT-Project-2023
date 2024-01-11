const express = require('express');

const router = express.Router();
const database = require('../controllers/database.js');


// redirect to library_info page
router.get('/library_info/:id',
    (req, res) => {
        res.redirect('/library_info?id=' + req.params.id);
    }
);


router.get('/library_info',
    (req, res, next) => {
        if (req.query['id']) {
            next();
        }
        else {
            res.redirect('/');
        }
    },
    (req, res, next) => {
        database.getLibraryInfo(req.query['id'], null, function (err, libraries) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.library = libraries;
                next();
            }
        })
    },

    (req, res, next) => {
        // displaying a static list of 12 books existing in this specific library (id)
        database.getBooksFromLibrary(req.query['id'], 12, function (err, books) {
            if (err) {
                console.log(err)
                console.log('error')
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.book = books;
                next();
            }
        })
    },
    (req, res) => {
        res.render('library_info', {
            title: 'Library Info',
            signedIn: req.session.signedIn,
        });
    }
);


module.exports = router;


