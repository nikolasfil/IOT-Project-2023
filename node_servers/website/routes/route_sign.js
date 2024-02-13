const express = require('express');

const router = express.Router();

const remoteDatabase = require('../controllers/remoteDatabase.js');


router.get('/sign_in', (req, res) => {
    res.redirect(req.get('referer'));
});


router.post('/sign_in',
    (req, res) => {
        let data = {
            id: req.body.id,
            password : req.body.psw
        }
        remoteDatabase.databaseRequest(link='/user/login',data, (err, result) => {
            if (err) {
                console.log(err);
                req.session.alert_message = err;
                res.redirect(req.get('referer'));
            }
            else {      
                console.log(result);
                req.session.signedIn = true;
                req.session.userid = result.u_id;
                req.session.role = result.role;
                res.redirect(req.get('referer'));
            }
        });
    }
);

router.post('/sign_up',
    (req, res, next) => {
        let data = {
            id: req.body.email
        }
        remoteDatabase.databaseRequest(link='/user/check',data, (err, result) => {
            if (err){
                console.log(err);
                req.session.alert_message = err;
                res.redirect(req.get('referer'));
            }
            if (result) {
                req.session.alert_message = 'User already exists';
                res.redirect(req.get('referer'));
            } else {
                next();
            }
        });
    },
    (req, res) => {
        let data = {
            user: req.body.data
        }
        remoteDatabase.databaseRequest(link='/user/add',data, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect(req.get('referer'));
            }
            else {
                req.session.signedIn = true;
                req.session.userid = req.body.id;
                req.session.role = "user";
                req.session.alert_message = 'You have successfully signed up';
                res.redirect(req.get('referer'));
            }
        });
    }
);



router.get('/sign_out', (req, res) => {
    req.session.destroy((err) => {
        console.log("session destroyed")
    })
    res.redirect('/')
});


module.exports = router;

