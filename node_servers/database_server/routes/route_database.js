const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');

// Add authentication later on !!!!! 

router.post('/fetchResults/:numOf',
    (req, res) => {
        res.send('fetchResults');
    });

router.get('/search',
    (req, res) => {
        res.send('search');
    });



   



router.post('/getAllDevicesJson',
    (req, res) => {
        database.getAllDevicesJson(data = req.body , (err, devices) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting devices")
            } else {
                res.status(200).send(devices);
            }
        }
    )}
    );





module.exports = router;


