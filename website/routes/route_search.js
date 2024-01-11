const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');

/**
 * returns the number of books that correspond to the parameters specified in the search
 */
router.post('/fetchNumOfResults', (req, res) => {

    let filters = JSON.stringify(req.body.filters);

    database.getAllDevices(id=null, serial=null, battery=null, status=null, type=null, limit=null, offset=null,numOf=true, function (err, devices) {

        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error Couldnt fetch number of results')
        } else {
            res.send(devices);
        }
    })
})


/**
 * Fetches the results that correspond to the parameters specified in the search page 
 */
router.post('/fetch_filters', (req, res) => {

    let filters = JSON.stringify(req.body.filters);

    database.getAllDevices(id=req.body.id, serial=null, battery=null, status=null, type=null, limit=null, offset=null,numOf=null, function (err, devices) {

    // database.getBookInfo(isbn = null, title = req.body.title, numOf = false, copies = true, filters = filters, limit = req.body.limit, offset = req.body.offset, function (err, books) {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.send(devices);
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

        // database.getAllDevices(id=null, serial=null, battery=null, status=null, type=null, limit=null, offset=null,numOf=null, function (err, devices) {

        database.getAllAtributes('DEVICE','status', limit = null, offset = null, function (err, devices)    {   
        if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.status = devices;
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


