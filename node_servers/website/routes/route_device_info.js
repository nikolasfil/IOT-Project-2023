const express = require('express');

const authentication = require('../controllers/authentication.js')
const router = express.Router();
const remoteDatabase = require('../controllers/remoteDatabase.js');
const middleware = require('../controllers/middleware.js');

// All this should first pass by the middleware login to be on the safe side

router.post('/assign',(req,res)=>{
    let data = req.body.data;
    remoteDatabase.databaseRequest(link='/devices/assign',data,(err, result) => {
        if (err) {
            res.status(500).send(err)
        } 
    })
})

// redirects to device_info page with serial as query
router.get('/device_info/:serial',
    (req, res) => {
        res.redirect('/device_info?serial=' + req.params.serial);
    }
);

/**
 * Returns a list of the locations where the device is located, data needed for the embedded map
 */
router.post('/map/:extra',
    authentication.demandAdminRights,
    // request the map/:device_id only if it is assigned to you or you are admin 
    (req, res) => {
        remoteDatabase.databaseRequest(link=`/devices/map/${req.params.extra}`,data={data:{}} ,(err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(result);
            }
        })
    },
)


// --------------

router.get("/fire_info",
    (req, res) => {
        let link = "http://150.140.186.118:1026/v2/entities?type=FireForestStatus"
        let link_data = {
            method: "GET",
            }
        remoteDatabase.fetchResponse(link,link_data,(err, result) => {
            if (err) {
                res.status(500).send(err)
            }
            else {
                // example = [
                //     {
                //         "id": "forest_status_0",
                //         "type": "FireForestStatus",
                //         "dateObserved": {
                //             "type": "DateTime",
                //             "value": "2024-02-14T18:51:43.682Z",
                //             "metadata": {},
                //         },
                //         "fireDetected": {"type": "Boolean", "value": false, "metadata": {}},
                //         "fireDetectedConfidence": {"type": "Float", "value": 0, "metadata": {}},
                //         "fireRiskIndex": {"type": "Float", "value": 0, "metadata": {}},
                //         "location": {
                //             "type": "geo:json",
                //             "value": {
                //                 "type": "Polygon",
                //                 "coordinates": [
                //                     [
                //                         [21.92257, 38.27095],
                //                         [21.98112, 38.29897],
                //                         [21.95278, 38.31716],
                //                         [21.91518, 38.31635],
                //                         [21.86109, 38.30934],
                //                         [21.88135, 38.28941],
                //                         [21.92257, 38.27095],
                //                     ]
                //                 ],
                //             },
                //             "metadata": {},
                //         },
                //     },
                // ]
                let fire_info = {}
                if (result.length >0){
                    // sort the result on the dateObserved.value 
                    
                    result.sort((a,b) => {
                        return new Date(b.dateObserved.value) - new Date(a.dateObserved.value);
                    })
                    // get the first element of the list
                    result = result[0];
                    // if (result.fireDetected && result.fireDetected.value){
                        fire_info.fireDetected = true;
                        fire_info["dateObserved"] = result.dateObserved.value;
                        fire_info["location"] = result.location.value.coordinates;
                    // }                    
                }
                res.send(fire_info);
            }
    })
    }
)



// Middleware 


router.get('/device_general',
    (req,res,next) => {

        // link = "http://172.22.0.3:5000/"
        link = "http://python-app:5000/"
        let link_data = {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }

        fetch(link, link_data).then((res) => {
            return res.json();
        }).then((data) => {
            // console.log(data);
            // Because it is async you have to let the next function know that it is done
            res.locals.info = data;
            next();
            return data;            
        }).catch(error => {
            console.log(error);
            res.send(error)
        });
    },      
    (req, res) => {
        res.send(res.locals.info);
    });


getSerialParameter = (req, res, next) => {
    if (req.query['serial']) {
        res.locals.serial = req.query['serial'];
        next();
    }
    else {
        res.redirect('/');
    }
}


getDeviceInformationDB = (req, res, next) => {
    // get device info
    let data = {
        serial: req.query['serial'],
        single: true
    }

    remoteDatabase.databaseRequest(link='/devices/all',data = data,(err, device) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error 1 ')
        } else {
            // assign the res.locals.device the first device in the list
            res.locals.device = device;
            next();
        }
    });
}


getDeviceHistory =(req,res,next) => {
    // select d_id,user_id,date_received,date_returned  
    // from DEVICE join Assigned on d_id = device_id   WHERE serial = ? 
    let data = {}
    data.query = "SELECT user_id,date_received,date_returned FROM DEVICE join Assigned on d_id = device_id WHERE serial = ? ORDER by date_received"
    data.arguments = [req.query['serial']]
    remoteDatabase.databaseRequest(link='/command/select',data,(err,device) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.locals.deviceHistory = device;
            next();
        }
    })
}

getDeviceLocation = (req,res,next) => {
    let data = {}
    data.query = "SELECT Tracked.* FROM DEVICE join Tracked on d_id = device_id WHERE serial = ? ORDER by date, time"
    data.arguments = [req.query['serial']]
    remoteDatabase.databaseRequest(link='/command/select',data,(err,device) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.locals.deviceLocation = device;
            next();
        }
    }
    )
}


getDevicePresses = (req,res,next) => {
    let data = {
        serial: req.query['serial']
    }
    remoteDatabase.databaseRequest(link='/devices/presses/buttons',data,(err,device) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.locals.devicePresses = device;
            next();
        }
    })
}


getAssignedUser = (req, res,next) => {
    let data = {
        serial: req.query['serial'],
        user: true,
        time_status: "current"
    }
    remoteDatabase.databaseRequest(link='/devices/assigned',data,(err,device) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            if(device.length===1){
                device = device[0];
            }
            res.locals.assignedUser = device;
            next();
        }
    })

}


getUnassignedUsers = (req,res,next) => {
    remoteDatabase.databaseRequest(link='/user/unassigned_users',data={},(err,result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.locals.unassignedUsers = result;
            next();
        }
    })
}

let deviceInfoList = [
    authentication.demandAuthentication,
    authentication.checkAdminRights,
    getSerialParameter,
    getDeviceInformationDB,
    middleware.getContextProvider,
    getDevicePresses,
    getDeviceLocation,
    getDeviceHistory,
    getAssignedUser,
    getUnassignedUsers,
]




// returns a list of device that have the given title
router.get('/device_info',
    deviceInfoList,
    (req, res) => {
        res.render('device_info', {
            title: 'device Info',
            style: ['device_info.css'],
        });
    });


// router.get('')


module.exports = router;


router.get('/device_location',
    getDeviceLocation,
    (req, res) => {
        res.send(res.locals.deviceHistory);
});
