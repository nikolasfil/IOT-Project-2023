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
            database.databaseRequest(link='/getAllDevicesJson',data = {status: 'active', type: 'tracker', limit: 12, exclusively:true}, function (err, devices) {
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
        res.render('homepage', {
            style: 'index.css',
            title: 'Home',
            signedIn: req.session.signedIn,
        });
    });



router.get('/homepage', (req, res) => {
    res.redirect('/');
});


module.exports = router;


