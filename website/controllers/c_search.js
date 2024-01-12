
exports.filtering=(req, res, next) =>{
    let filters = JSON.stringify(req.body.filters);
        
    // throw out all the keys in the json that don't they have an empty list as value
    filters = JSON.parse(filters)
    for (let key in filters) {
        if (filters[key].length == 0) {
            delete filters[key]
        }
    }
    res.locals.filters = filters;
    next();
}