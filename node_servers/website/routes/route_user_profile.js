const express = require('express');
const login = require('../controllers/login.js')

const database = require('../controllers/database.js');

const router = express.Router();

const userProfilePageMiddleware = (req, res) => { 
    res.render('user_profile', {
        title: 'User Profile',
        style: 'user_profile.css',
        signedIn: req.session.signedIn
    });
}

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
    database.databaseRequest(link='/userDetails',data, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.locals.profile = result;
            next();
        }
    });
}

router.get('/user_profile', 
    login.checkAuthentication,
    idAssignMiddleware,
    userInfoMiddleware,
    userProfilePageMiddleware
);


router.get("/user_profile/:id",
    (req, res) => {
        res.redirect('/user_profile?id=' + req.params.id);
    }
)


module.exports = router;


