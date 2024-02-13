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
        } else if (func === "check" || func === "login" || func === "details") {
            data.function = func;
            dbFunction = database.userDetails;
        // } else if (func === 'check') {
        //     dbFunction = database.checkIfUserExists;
        // } else if (func === 'login') {
        //     dbFunction = database.checkUser;
        // } else if (func === 'details') {
        //     dbFunction = database.userDetails;
        } else if (func === 'active_users') {
            dbFunction = database.getAllActiveUsers
        } else if (func === "assigned_dates") {
            dbFunction = database.getAssignedDates;
        } else if (func === "location_data") {
            data["device"] = "Asset tracking";
            if (req.query.date) {
                data["date"] = req.query.date;
            }
            dbFunction = database.getActiveAssignedDeviceData 
        } else if (func === "button_data") {
            data["device"] = "Buttons";
            if (req.query.date) {
                data["date"] = req.query.date;
            }
            dbFunction = database.getActiveAssignedDeviceData 
        } else {
            res.status(404).send("Invalid function");
        }
        functionChecker(data,dbFunction,res,func);
    }
)


router.post("/command",
(req, res) => {
    let data = req.body.data;
    functionChecker(data,database.execute,res,"command");

})


router.post("/devices/:function",
    (req, res) => {
    let data = req.body.data;
    let func = req.params.function;
    let dbFunction = null;

    if (func === "all") {
        console.log(data);
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

router.post("/device/:function/:type",
    (req, res) => {
        let data = req.body.data;
        let func = req.params.function;
        let type = req.params.type;
        let dbFunction = null;
        if (func === "all") {
            if (type === "buttons") {
                data["type"] = "Buttons";   
            } else if (type == "trackers") {
                data["type"] = "Asset tracking";
            }
            dbFunction = database.getAllDevicesJson;
        } else {
            res.status(404).send("Invalid function");
        }
        functionChecker(data,dbFunction,res,func);
    });


router.get("/test",
    (req, res) => {
        res.send("Test");
    }
);

module.exports = router;


