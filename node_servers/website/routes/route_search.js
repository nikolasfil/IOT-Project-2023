const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');
const login = require('../controllers/login.js')
const c_search = require('../controllers/c_search.js')



// 
/**
 * returns the number of devices that resulted from the search or the result of devices in the database
 */
router.post('/fetchResults/:numOf', 
    c_search.filtering,
    c_search.data_minining,
    (req, res, next) => {
        // get the data from the body
        let data = res.locals.data;
        if (req.params.numOf == 'true'){
            data.numOf = true;
        }
        database.getAllDevicesJson(data = data, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error Couldnt fetch number of results')
            } else {
                res.locals.devices = devices;
                next();
            }
        });
    },
    (req,res,next) => {
        if (req.params.numOf == 'true'){
            res.send(res.locals.devices);
        }
        else{
            next();
        }
    },
    (req, res) => {
        console.log(res.locals.devices)
        // res.send(res.locals.devices);
        res.render('partials/devices_grid',
        {
            layout: false,
            devices: res.locals.devices,
            signedIn: req.session.signedIn,
        });
    }
    )  



/**
 * Rendering the search page
 */
router.get('/search',
    // login.checkAuthentication,

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

    (req, res, next) => {
        // Fix this to be a differente function that returns the categories of the devices  
        // New category if they are assigned or not 
        res.locals.assigned = [{"name":"Assigned"}, {"name":"Unassigned"}];
        next();
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


