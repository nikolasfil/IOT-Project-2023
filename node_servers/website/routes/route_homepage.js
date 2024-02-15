const express = require('express');
const router = express.Router();

const remoteDatabase = require('../controllers/remoteDatabase.js');
const authentication = require('../controllers/authentication.js');
const middleware = require('../controllers/middleware.js')



homepage_render = (req, res) => {
    res.render('homepage', {
        style: ['index.css','heatmap.css'],
        title: 'Home',
    });
}

central_map = (req,res,next)=>{
    if (res.locals.signedIn && res.locals.isAdmin) {
        res.locals.serial = res.locals.active_trackers[0].serial;
    }
    next();
}

const homepage_route_list = [
    authentication.checkAuthentication,
    authentication.checkAdminRights,
    middleware.getAssignedTrackerInfoPerUser,
    middleware.getAssignedButtonInfoPerUser,
    middleware.getAllActiveUsers,
    middleware.getAllActiveTrackers,
    // central_map,
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


