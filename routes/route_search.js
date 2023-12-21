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
        // database.getAllAttribute('genre', limit = 5, offset = null, function (err, attributeList) {
        //     if (err) {
        //         console.log(err)
        //         res.status(500).send('Internal Server Error')
        //     } else {
        //         res.locals.genre = attributeList;
        //         next();
        //     }
        // });

        database.getAllDevices(id=null, serial=null, battery=null, status=null, type=null, limit=null, offset=null,function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.devices = devices;
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


