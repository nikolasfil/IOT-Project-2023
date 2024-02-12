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
            fun = database.checkUser;
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


router.post("/command/:function",
(req, res) => {
    let data = req.body.data;
    let func = req.params.function;
    let fun = null;
    if (func === 'select') {
        fun = database.select;
    } else if (func === 'insert') {
        fun = database.insert;
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
})




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


