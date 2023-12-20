const express = require('express');

const login = require('../controllers/login.js')
const router = express.Router();
const database = require('../controllers/database.js');


// redirects to book_info page with isbn as query
router.get('/book_info/:isbn',
    (req, res) => {
        res.redirect('/book_info?isbn=' + req.params.isbn);
    }
);

/**
 * Returns a list of the locations where the book is located, data needed for the embedded map
 */
router.get('/map/:isbn',
    (req, res) => {
        database.getLibraryIdOfBookByIsbn(req.params.isbn, (err, books) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.send(books);
            }
        })
    },
)

/**
 * Route used for reserving a copy of a book
 */
router.get('/reserve/:isbn/:library_id', login.checkAuthentication,
    (req, res, next) => {
        database.userDetails(req.session.email, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.locals.user = result;
                next();
            }
        });
    },
    (req, res) => {
        database.reserveBook(req.params.isbn, req.params.library_id, res.locals.user.id, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                req.session.alert_message = 'You have made your reservation. You have 24 hours in order to go to the library and borrow your book';
                console.log('Reservation made');
                res.redirect('/book_info?isbn=' + req.params.isbn);
            }
        })
    }

)

// returns a list of books that have the given title
router.get('/book_info',
    (req, res, next) => {
        if (req.query['isbn']) {
            next();
        }
        else {
            res.redirect('/');
        }
    },
    (req, res, next) => {
        // get book info
        database.getBookInfo(isbn = req.query['isbn'], title = null, numOf = false, copies = true, filters = null, limit = null, offset = null, (err, book) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                // assign the res.locals.book the first book in the list
                res.locals.book = book[0];
                next();
            }
        });
    },

    (req, res, next) => {
        if (req.session.signedIn) {
            // get library info
            database.getLibraryIdAndReservationOfBookByIsbn(req.query['isbn'], req.session.email, (err, libraryInfo) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Internal Server Error')
                } else {
                    res.locals.library = libraryInfo;
                    next();
                }
            });
            
        }
        else {
            // get library info
            database.getLibraryIdOfBookByIsbn(req.query['isbn'], (err, libraryInfo) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Internal Server Error')
                } else {
                    res.locals.library = libraryInfo;
                    next();
                }
            });
        }
    },

    (req, res) => {
        res.render('book_info', {
            title: 'Book Info',
            style: 'book_info.css',
            signedIn: req.session.signedIn
        });
    });

    

module.exports = router;


