const express = require('express');
const login = require('../controllers/login.js')

const database = require('../controllers/database.js');

const router = express.Router();


router.get('/user_profile', 
    login.checkAuthentication,
    (req, res, next) => {
        database.userDetails(req.session.userid, (err, result) => {
            console.log(result)
            if (err) {
                console.log(err);
            }
            else {
                res.locals.profile = result;
                next();
            }
        });
    },
    
    (req, res) => { 
        res.render('user_profile', {
            title: 'User Profile',
            style: 'user_profile.css',
            signedIn: req.session.signedIn
        });
    }
);


module.exports = router;


