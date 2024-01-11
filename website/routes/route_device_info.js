const express = require('express');

const login = require('../controllers/login.js')
const router = express.Router();
const database = require('../controllers/database.js');


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
        // database.getdeviceInfo(serial = req.query['serial'], title = null, numOf = false, copies = true, filters = null, limit = null, offset = null, (err, device) => {
        database.getAllDevicesJson(
            data = {
                serial:req.query['serial'] 
            },
                (err, device) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                // assign the res.locals.device the first device in the list

                res.locals.device = device[0];
                next();
            }
        });
    },
    

    (req, res) => {
        res.render('device_info', {
            title: 'device Info',
            style: 'device_info.css',
            signedIn: req.session.signedIn
        });
    });

    

module.exports = router;


