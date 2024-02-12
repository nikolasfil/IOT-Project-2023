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
                res.send(JSON.stringify(devices));
            }
        }
    )}
);



router.post('/getAllAttributes',
    (req, res) => {
        let data = req.body.data;
        
        database.getAllAttributes( data, (err, attributes) => {
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


router.post('/user/:function',
    (req,res) => {
        let data = req.body.data;
        let func = req.params.function;
        let fun = null;
        if (func === 'add') {
            fun = database.addUser;
        } else if (func === 'check') {
            fun = database.checkIfUserExists;
        } else if (func === 'login') {
            fun = database.checkIfUserExists;
        } else if (func === 'details') {
            fun = database.userDetails;
        } else {
            res.status(404).send("Invalid function");
        }
        if (fun){
            fun(data, (err, result) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send(JSON.stringify(result));
                }
            })
        } else {
            res.status(404).send("Invalid function");
        }
    }
)


router.post("/checkIfUserExists",
    (req, res) => {
        let data = req.body.data;
            
        database.checkIfUserExists(data, (err, exists) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while checking if user exists")
            } else {
                res.send(JSON.stringify(exists));
            }
        }
    )}
);

/**
 * @param {*} data JSON object with id 
 * @param {*} data.id id of the user to get the details of the account
 * @param {*} callback
 */
router.post("/userDetails",
    (req, res) => {
        let data = req.body.data;
        database.userDetails(data, (err, exists) => {
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
        let data = req.body.data
        database.checkUser(data, (err, exists) => {
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
        let data = req.body.data;

        database.select(data, (err, result) => {
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
        let data = req.body.data;
        // console.log(req.body);
        

        database.insert(data, (err, result) => {
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
        let data ={ user: req.body.data.user};
        
        database.addUser(data, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while adding user")
            } else {
                res.send(JSON.stringify(result));
            }
        }
    )}
);


router.post("/getAssignedDeviceInfoPerUser",
    (req, res) => {
        let data = req.body.data;
        database.getDeviceData(data, (err, devices) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting assigned devices")
            } else {
                res.send(JSON.stringify(devices));
            }
        }
    )}
);


router.post("/getAllActiveUsers",
    (req, res) => {
        database.getAllActiveUsers(data=req.body.data,(err, users) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error while getting all active users")
            } else {
                res.send(JSON.stringify(users));
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


