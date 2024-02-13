
const database = require('./remoteDatabase.js');

/**
 * Middleware to get all active devices if the user is an admin
 * saves the result of the database to the res.locals.active_trackers
 */
exports.getAllActiveTrackers= (req, res, next) => {
    if (res.locals.signedIn && res.locals.isAdmin) {
        database.databaseRequest(link='/devices/all',data = {status: 'active', type: 'Asset tracking', limit: 12, exclusively:true}, function (err, devices) {
            if (err) {
                console.log(err)
                console.log('getAllActiveTrackers')
                res.status(500).send("Internal Server Error")
            } else {
                res.locals.active_trackers = devices;
                next();
            }
        })
    } else {
        next();
    }
}


/**\
 * Middleware to gets the tracker data of the last tracker assigned to the user
 * 
 * Returns the information and events of the assigned tracker in the 
 * res.locals.assigned_tracker
 */
exports.getAssignedTrackerInfoPerUser=(req, res, next) => {
    if (res.locals.signedIn && res.locals.user_id) {
        database.databaseRequest(link='/devices/assigned',data = {id: res.locals.user_id,type: "Asset tracking", time_status:"current"}, function (err, devices) {
            if (err) {
                console.log(err)
                console.log('getAssignedTrackerInfoPerUser')
                res.status(500).send("Internal Server Error")
            } else {
                res.locals.assigned_tracker = devices;
                next();
            }
        })
    } else {
        next();
    }
}


/**
 * Middleware to gets the tracker data of the last tracker assigned to the user.
 * Saves the result of the database to the res.locals.assigned_button
 */
exports.getAssignedButtonInfoPerUser=(req, res, next) => {
    if (res.locals.signedIn) {
        database.databaseRequest(link='/devices/assigned',data = {id: res.locals.user_id, type: "Buttons"}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')   
            } else {
                res.locals.assigned_button = devices;
                next();
            }
        })
    } else {
        next();
    }
}


/**
 * 
 * saves the result of the database to the res.locals.active_users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAllActiveUsers = (req, res, next) => {
    if (res.locals.signedIn && res.locals.isAdmin) {
        database.databaseRequest(link='/user/active_users',data = {}, function (err, users) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.active_users = users;
                next();
            }
        })
    } else {
        next();
    }
}

/**
 * 
 * Saves the result of the database to the res.locals.assigned_dates
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getUserAssignedDates = (req, res, next) => {
    if (res.locals.signedIn) {
        database.databaseRequest(link='/user/assigned_dates',data = {id: res.locals.user_id, time_status:"current"}, function (err, dates) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.locals.assigned_dates = dates;
                next();
            }
        })
    } else {
        next();
    }
}


exports.getAvailableTrackers= (req, res, next) => {
    if (res.locals.signedIn && res.locals.isAdmin) {
        database.databaseRequest(link='/devices/available/trackers',data = {}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error getAvailableTrackers')
            } else {
                res.locals.available_trackers = devices;
                next();
            }
        })
    } else {
        next();
    }
}


exports.getAvailableButtons= (req, res, next) => {
    if (res.locals.signedIn && res.locals.isAdmin) {
        database.databaseRequest(link='/devices/available/buttons',data = {}, function (err, devices) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error getAvailableButtons')
            } else {
                res.locals.available_buttons = devices;
                next();
            }
        })
    } else {
        next();
    }
}