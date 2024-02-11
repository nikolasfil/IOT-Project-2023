const express = require('express');
const router = express.Router();

const database = require('../controllers/database.js');
const login = require('../controllers/login.js');


const homepage_route_list = [] 

getAllDevicesJson= (req, res, next) => {
    // this is a static device list displaying 12 active trackers
        database.databaseRequest(link='/getAllDevicesJson',data = {status: 'active', type: 'Asset tracking', limit: 12, exclusively:true}, function (err, devices) {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.locals.active_trackers = devices;
            next();
        }
    })
    
}

homepage_route_list.push(getAllDevicesJson)

checkPrivileges = (req,res,next) => {
    if (req.session.signedIn) {
        res.locals.signedIn = true;
        res.locals.user_id = req.session.userid;
    }
    next();
}


homepage_render = (req, res) => {
    console.log(res.locals.active_trackers)
    res.render('homepage', {
        style: 'index.css',
        title: 'Home',
        signedIn: req.session.signedIn,
    });
}


/**
 * Router for homepage
 */
router.get('/',homepage_route_list, homepage_render);



router.get('/homepage', (req, res) => {
    res.redirect('/');
});


module.exports = router;


