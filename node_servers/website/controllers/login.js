



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
 * Middleware that checks if a user is authenticated
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.demandAuthentication = (req, res, next) => {
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
 * Middleware that checks if a user is authenticated
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkAuthentication = (req, res, next) => {
    if (req.session.signedIn) {
        res.locals.signedIn = true;
        res.locals.user_id = req.session.userid;
    }
    next();
}


/**
 * Middleware that checks if a user has admin rights
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.demandAdminRights = (req, res, next) => {
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
    if (req.session.role === 'admin' ) {
        res.locals.is_admin = true;
    } 
    next();

}

