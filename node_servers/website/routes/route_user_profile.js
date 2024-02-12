const express = require('express');
const authentication = require('../controllers/authentication.js')

const database = require('../controllers/database.js');
const middleware = require('../controllers/middleware.js')

const router = express.Router();

const userProfilePageMiddleware = (req, res) => { 
    console.log(res.locals.profile);
    res.render('user_profile', {
        title: 'User Profile',
        style: 'user_profile.css',
    });
}

/**
 * 
 * Checks to see if there is a query parameter for the user id, which would imply that the user is an admin viewing another user's profile
 * Otherwise it will use the 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const idAssignMiddleware = (req, res, next) => {
    if (req.query.id){
        res.locals.user_id = req.query.id;
    } else {    
        res.locals.user_id = req.session.userid;
    }
    next();
}

const userInfoMiddleware = (req, res, next) => {
    let data = {   
        id: res.locals.user_id
    }
    database.databaseRequest(link='/user/details',data, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.locals.profile = result;
            next();
        }
    });
}

// Make a route to ask for history dates 

router.get('/user_profile', 
    authentication.checkAuthentication,
    idAssignMiddleware,
    middleware.getAssignedTrackerInfoPerUser,
    middleware.getAssignedButtonInfoPerUser,
    middleware.getUserAssignedDates,
    userInfoMiddleware,
    userProfilePageMiddleware
);


router.get("/user_profile/:id",
    (req, res) => {
        res.redirect('/user_profile?id=' + req.params.id);
    }
)


module.exports = router;


