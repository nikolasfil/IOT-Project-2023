
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


exports.data_minining = (req, res, next) => {
        let data ={};
        let filters = res.locals.filters;

        data.limit = req.body.limit;
        data.offset = req.body.offset;

        if (filters.assigned && filters.assigned.includes('Assigned') ){
            console.log(filters);
            data.u_id = req.body.searchValue;
            data.assigned = true;
            // delete filters.assigned;
        } else if (filters.assigned && filters.assigned.includes('Unassigned') ){
            data.assigned = false;
            // delete filters.assigned;
        }
        // else { 
            // data.assigned = false;
            // delete filters.assigned;
        // }

        data.filters = filters;
        
        data.serial = req.body.searchValue;
        data.d_id = req.body.searchValue;

        data.exclusively = req.body.exclusively;
        data.regex = req.body.regex;

        res.locals.data = data;
        next();
}
