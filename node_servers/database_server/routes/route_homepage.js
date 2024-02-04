const express = require('express');
const router = express.Router();

const database = require('../controllers/database.js');
const login = require('../controllers/login.js');


/**
 * Router for homepage
 */
router.get('/',
    (req, res, next) => {
        // this is a static device list displaying 12 active trackers
            database.getAllDevicesJson(data = {status: 'active', type: 'tracker', limit: 12}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.active_trackers = devices;
                next();
            }
        })
        
    },
    
    
    (req, res) => {
        res.send(res.locals.active_trackers);

    });



router.get('/homepage', (req, res) => {
    res.redirect('/');
});


module.exports = router;


