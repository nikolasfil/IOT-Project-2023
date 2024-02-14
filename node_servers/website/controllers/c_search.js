
exports.filtering=(req, res, next) =>{
    let filters = JSON.stringify(req.body.filters);
    // throw out all the keys in the json that don't they have an empty list as value
    filters = JSON.parse(filters)
    for (let key in filters) {
        if (filters[key].length == 0) {
            delete filters[key]
        }
    }

    let data = {};

    if (filters.assigned && filters.assigned.includes('Assigned') ){
        data.u_id = req.body.searchValue;
        data.assigned = true;
    } else if (filters.assigned && filters.assigned.includes('Unassigned') ){
        data.assigned = false;
    }

    res.locals.filters = filters;
    res.locals.data = data;
    next();
}


exports.data_minining = (req, res, next) => {
    let data = res.locals.data;

    data.filters = res.locals.filters;

    data.limit = req.body.limit;
    data.offset = req.body.offset;
    
    data.serial = req.body.searchValue;
    data.d_id = req.body.searchValue;

    data.exclusively = req.body.exclusively;
    data.regex = req.body.regex;

    res.locals.data = data;
    next();
}

