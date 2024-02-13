const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');


function functionChecker (data,dbFunction,res,func) {
    if (dbFunction){
        dbFunction(data, (err, result) => {
            if (data.debug){
                console.log("functionChecer Callback")
                console.log(data);
                console.log(result)
                console.log(err);
            }
            if (err) {
                res.status(500).send(err)
            } else {
                // console.log(data)
                // console.log(result);
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
        if (func === "add" || func === "check" || func === "login" || func === "details") {
            data.function = func;
            dbFunction = database.userFunctions;
        } else if (func === 'active_users') {
            dbFunction = database.getAllActiveUsers
        } else if (func === "assigned_dates") {
            dbFunction = database.getAssignedDates;
        } else if (func === "location_data") {
            data["type"] = "Asset tracking";
            if (req.query.date) {
                data["date"] = req.query.date;
            }
            data["limit"] = 1;
            dbFunction = database.getActiveAssignedDeviceData 
        } else if (func === "button_data") {
            data["type"] = "Buttons";
            if (req.query.date) {
                data["date"] = req.query.date;
            }
            data["limit"] = 1;

            dbFunction = database.getActiveAssignedDeviceData 
        } else {
            dbFunction = null;
        }

        functionChecker(data,dbFunction,res,func);
    }
)



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
    // } else if (func ==="available"){

    } else if (func === "assign") {
        console.log(data);
    } else {
        dbFunction = null;
    }

    functionChecker(data,dbFunction,res,func);
    }
)

router.post("/devices/:function/:extra",
    (req, res) => {
        let data = req.body.data;
        let func = req.params.function;
        let extra = req.params.extra;
        let dbFunction = null;
        if (extra === "buttons") {
            data["type"] = "Buttons";   
        } else if (extra == "trackers") {
            data["type"] = "Asset tracking";
        }

        if (func === "all") {   
            dbFunction = database.getAllDevicesJson;
        } else if (func === "available") {
            data["assigned"] = false;
            data["status"] = "active";
            data["exclusively"] = true;
            data["debug"] = "devices/available/trackers";
            dbFunction = database.getAllDevicesJson;
            

        } else if (func === "assigned") {
            data["assigned"] = true;
            data["status"] = "active";
            data["exclusively"] = true;
            data["debug"] = "devices/available/buttons";
            
            dbFunction = database.getAllDevicesJson;
        } else {
            dbFunction = null;
        }
        functionChecker(data,dbFunction,res,func);
    });



router.post("/command",
(req, res) => {
    let data = req.body.data;
    functionChecker(data,database.execute,res,"command");

})


router.get("/test",
    (req, res) => {
        res.send("Test");
    }
);

module.exports = router;


