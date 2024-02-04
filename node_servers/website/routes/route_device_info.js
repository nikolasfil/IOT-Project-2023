const express = require('express');

const login = require('../controllers/login.js')
const router = express.Router();
const database = require('../controllers/database.js');

// All this should first pass by the middleware login to be on the safe side

router.post('/device_info/assigned',
    (req,res,next) => {
        // If the variable mode: read is in the body, then it should return jsons of the user information 
        // If the variable mode: write is in the body then it should update the database with the new information about the device assigned to the user
        if (req.body.mode === 'read'){
            next();
        }
        else if (req.body.mode === 'write'){
            next();
        }
        else{
            res.status(400).send('Bad Request')
        }
    }
)


// redirects to device_info page with serial as query
router.get('/device_info/:serial',
    (req, res) => {
        res.redirect('/device_info?serial=' + req.params.serial);
    }
);

/**
 * Returns a list of the locations where the device is located, data needed for the embedded map
 */
router.get('/map/:serial',
    (req, res) => {
        database.getLibraryIdOfdeviceByserial(req.params.serial, (err, device) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.send(device);
            }
        })
    },
)


router.get('/device_general',
    (req,res,next) => {

        // link = "http://172.22.0.3:5000/"
        link = "http://python-app:5000/"
        let link_data = {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }

        fetch(link, link_data).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            // Because it is async you have to let the next function know that it is done
            res.locals.info = data;
            next();
            return data;            
        }).catch(error => {
            console.log(error);
            res.send(error)
        });
    },      
    (req, res) => {
        console.log(res.locals.info);   
        res.send(res.locals.info);
    });

// returns a list of device that have the given title
router.get('/device_info',
    (req, res, next) => {
        if (req.query['serial']) {
            next();
        }
        else {
            res.redirect('/');
        }
    },
    (req, res, next) => {
        // get device info
        let data = {}
        data.serial = req.query['serial'];
        database.getAllDevicesJson(data = data,(err, device) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                // assign the res.locals.device the first device in the list
                res.locals.device = device[0];
                console.log(res.locals.device)
                next();
            }
        });
    },

    // (req,res,next) => {
    //     // select d_id,user_id,date_received,date_returned  
    //     // from DEVICE join Assigned on d_id = device_id   WHERE serial = ? 
    //     let command = {}
    //     command.query = "SELECT user_id,date_received,date_returned FROM DEVICE join Assigned on d_id = device_id WHERE serial = ? ORDER by date_received DESC LIMIT 1"
    //     command.arguments = [req.query['serial']]
    //     database.select(command,(err,user) => {
    //         if (err) {
    //             console.log(err)
    //             res.status(500).send('Internal Server Error')
    //         } else {
    //             res.locals.deviceUser = user;
    //             console.log(res.locals.deviceUser)
    //             next();
    //         }
    //     })
    // },
    (req,res,next) => {
        // select d_id,user_id,date_received,date_returned  
        // from DEVICE join Assigned on d_id = device_id   WHERE serial = ? 
        let command = {}
        command.query = "SELECT user_id,date_received,date_returned FROM DEVICE join Assigned on d_id = device_id WHERE serial = ? ORDER by date_received"
        command.arguments = [req.query['serial']]
        database.select(command,(err,device) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.deviceHistory = device;
                next();
            }
        })
    },
    (req, res) => {
        res.render('device_info', {
            title: 'device Info',
            style: 'device_info.css',
            signedIn: req.session.signedIn
        });
    });



module.exports = router;

