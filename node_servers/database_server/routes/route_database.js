const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');


function functionChecker (data,dbFunction,res,func) {
    if (dbFunction){
        dbFunction(data, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(JSON.stringify(result));
            }
        })
    } else {
        res.status(404).send(`Invalid function: ${func}`);
    }
}

router.post('/user/:function',
    (req,res) => {
        let data = req.body.data;
        let func = req.params.function;
        let dbFunction = null;
        if (func === 'add') {
            dbFunction = database.addUser;
        } else if (func === 'check') {
            dbFunction = database.checkIfUserExists;
        } else if (func === 'login') {
            dbFunction = database.checkUser;
        } else if (func === 'details') {
            dbFunction = database.userDetails;
        } else if (func === 'active_users') {
            dbFunction = database.getAllActiveUsers
        } else if (func === "assigned_dates") {
            dbFunction = database.getAssignedDates;
        } else {
            res.status(404).send("Invalid function");
        }
        functionChecker(data,dbFunction,res,func);
    }
)


router.post("/command/:function",
(req, res) => {
    let data = req.body.data;
    let func = req.params.function;
    let dbFunction = null;
    if (func === 'select') {
        dbFunction = database.select;
    } else if (func === 'insert') {
        dbFunction = database.insert;
    } else {
        res.status(404).send("Invalid function");
    }
    functionChecker(data,dbFunction,res,func);

})


router.post("/devices/:function",
    (req, res) => {
    let data = req.body.data;
    let func = req.params.function;
    let dbFunction = null;
       
    if (func === "all") {
        dbFunction = database.getAllDevicesJson;
    } else if (func === "attributes") {
        dbFunction = database.getAllAttributes;
    } else if (func === "assigned") {
        dbFunction = database.getActiveAssignedDeviceData
    // } else if (func === "") {
    } else {
        res.status(404).send("Invalid function");
    }

    functionChecker(data,dbFunction,res,func);
    }
)


router.get("/test",
    (req, res) => {
        res.send("Test");
    }
);

module.exports = router;


