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
        database.getAllDevicesJson(data = req.body.data , (err, devices) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting devices")
            } else {
                // console.log(devices);
                res.send(JSON.stringify(devices));
            }
        }
    )}
    );



router.post('/getAllAttributes',
    (req, res) => {
        let source = req.body.data.source;
        let attribute = req.body.data.attribute; 
        let limit = req.body.data.limit;
        let offset = req.body.data.offset;
        console.log(req.body);
        database.getAllAttributes( source,attribute,limit,offset, (err, attributes) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting attributes")
            } else {
                // console.log(attributes);
                res.send(JSON.stringify(attributes));
            }
        }
    )}
    );


router.post("/checkIfUserExists",
    (req, res) => {
        let id = req.body.data.id;
        database.checkIfUserExists(id, (err, exists) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while checking if user exists")
            } else {
                res.send(JSON.stringify(exists));
            }
        }
    )}
    );





module.exports = router;


