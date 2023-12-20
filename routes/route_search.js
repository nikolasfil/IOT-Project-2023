const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');

/**
 * returns the number of books that correspond to the parameters specified in the search
 */
router.post('/fetchNumOfResults', (req, res) => {

    let filters = JSON.stringify(req.body.filters);

    database.getBookInfo(isbn = null, title = req.body.title, numOf = true, copies = null, filters = filters, limit = null, offset = null, function (err, books) {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error Couldnt fetch number of results')
        } else {
            res.send(books);
        }
    })
})


/**
 * Fetches the results that correspond to the parameters specified in the search page 
 */
router.post('/fetch_filters', (req, res) => {

    let filters = JSON.stringify(req.body.filters);

    database.getBookInfo(isbn = null, title = req.body.title, numOf = false, copies = true, filters = filters, limit = req.body.limit, offset = req.body.offset, function (err, books) {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.send(books);
        }
    })
})


/**
 * Rendering the search page
 */
router.get('/search',
    (req, res, next) => {
        // Fetches the genre filters that have the most books
        database.getAllAttribute('genre', limit = 5, offset = null, function (err, attributeList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.genre = attributeList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the rest of the genre filters 
        database.getAllAttribute('genre', -1, 5, function (err, attributeList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.all_genre = attributeList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the publisher filters that have the most books
        database.getAllAttribute('publisher', -1, 5, function (err, publisherList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.all_publisher = publisherList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the rest of the publisher filters         
        database.getAllAttribute('publisher', 5, null, function (err, publisherList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.publisher = publisherList;
                next();
            }
        });
    },
    (req, res, next) => {
        // Fetches the edition filters that have the most books
        database.getAllAttribute('edition', 4, null, function (err, editionList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.edition = editionList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the rest of edition filters

        database.getAllAttribute('edition', -1, 4, function (err, editionList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.all_edition = editionList;
                next();
            }
        });
    },

    
    (req, res, next) => {
        // Fetches the language filters that have the most books 
    
        database.getAllAttribute('language', 4, null, function (err, languageList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.language = languageList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the rest of language filters

        database.getAllAttribute('language', -1, 4, function (err, languageList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.all_language = languageList;
                next();
            }
        });
    },


    (req, res, next) => {
        // Fetches the libraries

        database.getAllAttribute('library', 4, null, function (err, libraryList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.library = libraryList;
                next();
            }
        });
    },

    (req, res, next) => {
        // Fetches the rest of the libraries
        database.getAllAttribute('library', -1, 4, function (err, libraryList) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            else {
                res.locals.all_library = libraryList;
                next();
            }
        });
    },

    (req, res) => {
        res.render('search', {
            title: 'Search',
            signedIn: req.session.signedIn,
            searchBarValue: req.query.search,
        });
    }
);


module.exports = router;


