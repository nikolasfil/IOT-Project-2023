const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');


// Change the search to include complex like id:1, serial:2342 and so forth for the users 

/**
 * returns the number of books that correspond to the parameters specified in the search
 */
router.post('/fetchNumOfResults', (req, res) => {
    let data ;
    let filters = JSON.stringify(req.body.filters);
    // throw out all the keys in the json that don't they have an empty list as value
    filters = JSON.parse(filters)

    for (let key in filters) {
        if (filters[key].length == 0) {
            delete filters[key]
        }
    }

    data = {filters:filters, numOf: true}

    if (req.body.searchValue) {
        data.serial = req.body.searchValue;
        data.id = req.body.searchValue;
        // data.user = req.body.searchValue;
        data.exclusively = null;
        // data.regex = true;
    }

    database.getAllDevicesJson(data = data, function (err, devices) {
        // database.getAllDevicesJson(data = {filters:filters,serial:req.body.serial, id:req.body.id, numOf: true}, function (err, devices) {
        if (err) {
            console.log(err)
            console.log(filters)
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

    let data ;
    let filters = JSON.stringify(req.body.filters);
    
    // throw out all the keys in the json that don't they have an empty list as value
    filters = JSON.parse(filters)
    for (let key in filters) {
        if (filters[key].length == 0) {
            delete filters[key]
        }
    }

    data = {filters:filters, limit: req.body.limit, offset:req.body.offset }

    if (req.body.searchValue) {
        data.serial = req.body.searchValue;
        data.id = req.body.searchValue;
        // data.user = req.body.searchValue;
        data.exclusively = null;
        // data.regex = true;
    }

    // database.getAllDevicesJson(data = {filters:filters,serial:req.body.serial, id:req.body.id, limit: req.body.limit, offset:req.body.offset }, function (err, devices) {
    database.getAllDevicesJson(data = data , function (err, devices) {
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

    (req, res, next) => {
        database.getAllAtributes('DEVICE','type', limit = null, offset = null, function (err, devices)    {   
        if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.type = devices;
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


