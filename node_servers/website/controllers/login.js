
/**
 * Middleware that checks if a user is authenticated
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkAuthentication = (req, res, next) => {
    if (req.session.signedIn) {
        res.locals.signedIn = true;
        next();
    }
    else {
        req.session.alert_message = 'You have to sign up in order to access this function';
        res.redirect('/');
    }
}

/**
 * Middleware that is responsible for all popup messages
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.alerting = (req, res,next) => {
    if (req.session.alert_message && req.session.alert_message.length>0) {
        res.locals.message =req.session.alert_message;
        req.session.alert_message=null;
    }
    next();
}


/**
 * Middleware that checks if a user has admin rights
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkAdminRights = (req, res, next) => {
    if (req.session.role === 'admin' ) {
        next();
    } 
    else {
        req.session.alert_message = 'You have to be an admin to access this function';
        res.redirect('/');
    }
}



/**
 * Middleware that checks if a user has admin rights
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkAdminRights = (req, res, next) => {
    if (req.session.signedIn && req.session.role === 'admin') {
        next();
    }
    else {
        req.session.alert_message = 'You have to be an admin to access this function';
        res.redirect('/');
    }
}