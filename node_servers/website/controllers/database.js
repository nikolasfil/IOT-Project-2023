require('dotenv').config();


// --------- Generic Functions ---------



/**
 * Connects to the database server that is specified in the .env file. 
 *  
 * @param {*} route The link that specifies the request for the database 
 * @param {*} data A json object that contains the data that is going to be sent to the database
 * @param {*} callback The function that handles the result
 * @returns the response of the request from the database
 */
async function fetchResponse(route, data, callback){
    
    let link = process.env.DBURL + route
    console.log(link)

    let link_data = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({data:data}),
        // body: data,
        
    }
    
    let response =  fetch(link, link_data).then((res) => {
        return res.text();
    }).then((data) => {
        return JSON.parse(data);
    }).then((data) => {
        callback(null, data)
    }).catch(error => {
        callback(error, null)
        console.log(error);
    });

    return response;
}



/**
 * 
 * 
 * @param {*} activated_name 
 * @param {*} linker 
 * @param {*} regex 
 * @returns 
 */

exports.addingActivated=(activated_name, linker, regex)=> {
    let query_activated ;
    
    console.log(regex)
    if (!regex){
        query_activated = activated_name.map((name) => `${name} = ?`).join(linker)
    }
    else {
        let searchable = [] ;

        this.getAllDevicesJson(data={linker:'or', regex:false}, function(err, rows) {
            searchable.push(rows.map(row => row.serial));
            searchable.push(rows.map(row => row.d_id));
            // searchable.push(rows.map(row => row.user));
        })
        
        query_activated = activated_name.map(
            (name) => `${name} in (${getRegex(name, searchable).map(word => `'${word}'`).join(',')})`
            ).join(linker)
    }    
    return query_activated
}

// --------- Dynamic Selection from Database 


/**
 * Returns information about the device . Every option other than callback is optional , if no option is given it will return all the devices
 * @param {*} data contains everything in a json format (not optional)
 * @param {*} id For a specific device (optional)
 * @param {*} serial For a specific serial (optional)
 * @param {*} battery For a specific battery (optional)
 * @param {*} status For a specific status (optional)
 * @param {*} type For a specific type (optional)
 * @param {*} limit Limiting the number of results (optional)
 * @param {*} offset Starting from a specific result (optional)
 * @param {*} numOf true or null, if we want to focus more on the number of results back (optional)
 * @param {*} filters Filters that are applied (optional), json of the form {key: [value1, value2, ...]}
 * @param {*} callback function that handles the results
 *  
 * This function is the same as getAllDevices but it returns the results in a json format
*/
exports.getAllDevicesJson= (data,  callback) =>  {
    
    let link = '/getAllDevicesJson'
    let link_data = data

    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}


exports.getAllAttributes=(source,attribute, limit, offset, callback) =>  {
    let link = '/getAllAttributes'
    let link_data = {
        "source": source,
        "attribute": attribute,
        "limit": limit,
        "offset": offset
    }
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}

exports.checkIfUserExists= (id, callback) =>  {
    let link = '/checkIfUserExists'
    let link_data = {
        "id": id
    }
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}

exports.userDetails= (id, callback) =>  {
    let link = '/userDetails'
    let link_data = {
        "id": id
    }
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}

exports.checkUser= (id, password, callback) =>  {

    let link = '/checkUser'
    let link_data = {
        "id": id,
        "password": password
    }
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}


// --------- Static Selection in the database -----------

exports.select=(command, callback) =>  {
    let link = '/select'
    let link_data = {command: command}
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });

}


exports.insert = (command,callback) => {
    let link = '/insert'
    let link_data = {command: command}
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}


// --------- Dynamic Insertion into Database --------

exports.addUser= (user, callback) =>  {
    let link = '/addUser'
    let link_data = {"user":user}
    fetchResponse(link, link_data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}

// ----------------------------------------------------
