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

getAssignedTrackerInfoPerUser=(req, res, next) => {
    if (res.locals.signedIn) {
        database.databaseRequest(link='/getAssignedDeviceInfoPerUser',data = {id: res.locals.user_id,device: "Asset tracking"}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.assigned_tracker = devices;
                next();
            }
        })
    } else {
        next();
    }
}

getAssignedButtonInfoPerUser=(req, res, next) => {
    if (res.locals.signedIn) {
        database.databaseRequest(link='/getAssignedDeviceInfoPerUser',data = {id: res.locals.user_id, device: "Buttons"}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.assigned_button = devices;
                next();
            }
        })
    } else {
        next();
    }
}



homepage_render = (req, res) => {
    res.render('homepage', {
        style: 'index.css',
        title: 'Home',
    });
}

const homepage_route_list = [
    login.checkAuthentication,
    login.checkAdminRights,
    getAssignedTrackerInfoPerUser,
    getAssignedButtonInfoPerUser,
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


