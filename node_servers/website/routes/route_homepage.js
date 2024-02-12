const express = require('express');
const router = express.Router();

const database = require('../controllers/database.js');
const authentication = require('../controllers/authentication.js');
const middleware = require('../controllers/middleware.js')



homepage_render = (req, res) => {
    console.log(res.locals.assigned_tracker)
    res.render('homepage', {
        style: ['index.css','heatmap.css'],
        title: 'Home',
    });
}

const homepage_route_list = [
    authentication.checkAuthentication,
    authentication.checkAdminRights,
    middleware.getAssignedTrackerInfoPerUser,
    middleware.getAssignedButtonInfoPerUser,
    middleware.getAllActiveUsers,
    middleware.getAllActiveTrackers,
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


