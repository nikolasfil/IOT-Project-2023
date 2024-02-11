const express = require('express');
const router = express.Router();

const database = require('../controllers/database.js');
const login = require('../controllers/login.js');


/**
 * Middleware to get all active devices if the user is an admin
 */
getAllDevicesJson= (req, res, next) => {
    if (res.locals.signedIn && res.locals.is_admin) {
        database.databaseRequest(link='/getAllDevicesJson',data = {status: 'active', type: 'Asset tracking', limit: 12, exclusively:true}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.active_trackers = devices;
                next();
            }
        })
    } else {
        next();
    }
}


homepage_render = (req, res) => {
    console.log(homepage_route_list)
    res.render('homepage', {
        style: 'index.css',
        title: 'Home',
        signedIn: req.session.signedIn,
    });
}

const homepage_route_list = [
    login.checkAuthentication,
    login.checkAdminRights,
    getAllDevicesJson,
    homepage_render
] 


/**
 * Router for homepage
 */
router.get('/',homepage_route_list);



router.get('/homepage', (req, res) => {
    res.redirect('/');
});


module.exports = router;


