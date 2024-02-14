const express = require('express');
const router = express.Router();
const database = require('../controllers/database.js');


function functionChecker (data,dbFunction,res,func) {
    if (dbFunction){
        dbFunction(data, (err, result) => {
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
            dbFunction = database.getDeviceData;
        } else if (func === "location_data") {
            data["assigned"] = true;
            data["type"] = "Asset tracking";
            if (req.query.date) {
                data["date"] = req.query.date;
            }
            data["limit"] = 1;
            dbFunction = database.getActiveAssignedDeviceData 
        } else if (func === "button_data") {
            data["assigned"] = true;
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
    }  else if (func === "assign") {
        console.log(data);
    } else if (func === "assigned" ) {
        data["assigned"] = true;
        dbFunction = database.getDeviceData;
    }else {
        dbFunction = null;
    }

    functionChecker(data,dbFunction,res,func);
    }
)


/**
 * /devices/all/buttons
 * /devices/all/trackers
 * /devices/available/buttons
 * /devices/available/trackers
 * /devices/assigned/buttons
 * /devices/assigned/trackers
 * /devices/map/:d_id
 */
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
            dbFunction = database.getAllDevicesJson;
        } else if (func === "assigned") {
            data["assigned"] = true;
            data["time_status"]="current"
            dbFunction = database.getDeviceData;
        } else if (func === "map") {
            data["event"] = true;
            data["type"] = "Asset tracking";
            data["serial"] = extra;
            // data["time_status"] = "current";
            dbFunction = database.getDeviceData
        } 
        else {
            dbFunction = null;
        }
        functionChecker(data,dbFunction,res,func);
    });



router.post("/command/:function",
(req, res) => {
    let data = req.body.data;
    let dbFunction = null;
    let func = req.params.function;
    if (func === "select"){
        dbFunction = database.execute;
    } else if (func === "insert") {
        dbFunction = database.insert;
    }
    functionChecker(data,dbFunction,res,func);

})


router.get("/test",
    (req, res) => {
        res.send("Test");
    }
);

module.exports = router;


