const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');

// Add authentication later on !!!!! 

router.post('/fetchResults/:numOf',
    (req, res) => {
        res.send('fetchResults');
    }
);


   



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
        database.getAllAttributes( source,attribute,limit,offset, (err, attributes) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting attributes")
            } else {
                // console.log(attributes);
                res.send(JSON.stringify(attributes));
            }
        })
    }
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


router.post("/userDetails",
    (req, res) => {
        let id = req.body.data.id;
        database.userDetails(id, (err, exists) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting user details")
            } else {
                res.send(JSON.stringify(exists));
            }
        }
    )}
);

router.post("/checkUser",
    (req, res) => {
        let id = req.body.data.id;
        let password = req.body.data.password;
        database.checkUser(id,password, (err, exists) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while checking if user credentials are accurate")
            } else {
                res.send(JSON.stringify(exists));
            }
        }
    )}
);


router.post("/select",
    (req, res) => {
        let command = req.body.data.command;

        database.select(command, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while executing select command")
            } else {
                res.send(JSON.stringify(result));
            }
        }
    )}
);


router.post("/insert",
    (req, res) => {
        let command = req.body.data.command;

        database.insert(command, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while executing insert command")
            } else {
                res.send(JSON.stringify(result));
            }
        }
    )}
);

router.post("/addUser",
    (req, res) => {
        let user = req.body.data.user;
        
        database.addUser(user, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while adding user")
            } else {
                res.send(JSON.stringify(result));
            }
        }
    )}
);


router.get("/test",
    (req, res) => {
        res.send("Test");
    }
);

module.exports = router;


