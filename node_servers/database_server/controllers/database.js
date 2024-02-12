const sql = require('better-sqlite3')
const betterDb = new sql('model/database.sqlite')

const bcrypt = require('bcrypt');


// --------- Generic Functions ---------

/**
 * 
 * Replaces the strings to exclude special characters
 * 
 * @param {*} string String to trim the special characters 
 * @returns 
 */
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 
 * Match the partials of the searchValue 
 * 
 * @param {*} searchValue 
 * @param {*} rows 
 * @returns 
 */
function getRegex(searchValue, rows) {

    // let rows;
    // let query ;

    // try {
    //     rows = betterDb.prepare().all()

    // } catch (err) {
    //     throw err;
    // }

    // const commonWords = [
    //     'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I']

    searchValue = searchValue.trim();
    const words = searchValue.split(" ");

    // const partialWords = words.filter(word => !commonWords.includes(word));

    // const partialPattern = partialWords.map(word => `(?:\\b|\\B)${escapeRegExp(word)}\\w*(?:\\b|\\B)`).join('|');
    const partialPattern = words.map(word => `(?:\\b|\\B)${escapeRegExp(word)}\\w*(?:\\b|\\B)`).join('|');

    const exactPattern = `\\b${escapeRegExp(searchValue)}\\b`;

    const pattern = `(?:${partialPattern}|${exactPattern})`;

    const matchingPhrases = rows.filter(row => new RegExp(pattern, 'i').test(row.searchValue)).map(row => row.searchValue);

    return matchingPhrases;

}

/**
 * 
 * 
 * 
 * @param {*} activated_name 
 * @param {*} linker 
 * @param {*} regex 
 * @returns 
 */
exports.addingActivated=(activated_name, linker, regex)=> {
    let query_activated ;
    
    // console.log(regex)
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
 * @param {*} data.id For a specific device (optional)
 * @param {*} data.serial For a specific serial (optional)
 * @param {*} data.battery For a specific battery (optional)
 * @param {*} data.status For a specific status (optional)
 * @param {*} data.type For a specific type (optional)
 * @param {*} data.limit Limiting the number of results (optional)
 * @param {*} data.offset Starting from a specific result (optional)
 * @param {*} data.numOf true or null, if we want to focus more on the number of results back (optional)
 * @param {*} data.filters Filters that are applied (optional), json of the form {key: [value1, value2, ...]}
 * @param {*} callback function that handles the results
 *  
 * This function is the same as getAllDevices but it returns the results in a json format
*/
exports.getAllDevicesJson= (data,  callback) =>  {
    

    // Defining the variables
    let stmt, device, query, query_filters, query_activated, linker;
    
    // initializing some variables
    query_filters = "";
    query_activated = "";
    query_unassigned = "";
    
    // ----------- initializing arguments -----------

    // Assigning value to the linker, if it is to search every possibility or strict correlations 
    if (!data.exclusively) {
        linker = ' or '
    }else {
        linker = ' and '
    }

    // Working on the arguments provided
    let activated = []; 
    let activated_name = [];

    // List of arguments to exclude from iteration
    let non_iterated = ['filters', 'limit', 'offset', 'numOf','exclusively', 'linker','regex','assigned']




    // ----------- Building the list of activated arguments ----------- 

    // Iterate through the data json and add to the activated list the arguments that are activated and to the activated_name the key of that 
    for (let key in data) {
        // Get all the data that are not null and are not in the not iterate list 
        if (data[key] && !non_iterated.includes(key)) {
            activated.push(data[key])
            activated_name.push(key)
        }
    }



    // ----------- Building the query -----------

    query = ` Select `

    if (data.numOf ) {
        // If the numOf is true then it will return the number of results
        query += ` COUNT(*) as count_result`
    }
    
    if (data.numOf && data.assigned) {
        // If the request if for both the number of results data fields and information on assigned
        query += ` , `
    } else if (!data.numOf && !data.assigned) {
        // If the request is not for the number or results and it does not include fields, then return everything
        query += ` * `
    } 

    if (data.assigned){
        // We want specific fields to be reutrned if the request is for the assigned devices
        // Else it will return all the fields of the Assigned table so that they are joined
        query += ` d_id , serial, battery, status, type, u_id, first_name, last_name, phone, date_received, date_returned `
    } 


    // Add the table name
    query += ` FROM DEVICE `
    
    if (data.assigned) {
        // Join the tables we want if the request is for the assigned devices
        query += ` JOIN Assigned on d_id = device_id JOIN USER on user_id = u_id`
    } else if (data.assigned === false ){ 
        // If the request is for the unassigned devices then we want to exclude the assigned devices
        query_unassigned = `  d_id NOT IN (SELECT device_id FROM Assigned) `
    }


    // ----------- Building the activated arguments -----------

    
    // query_activated = activated_name.map((name) => `${name} = ?`).join(linker)
    // This query returns the results from search that are in the activated arguments
    query_activated = this.addingActivated(activated_name, linker, data.regex)
    

    // ----------- Building the filters -----------

    let filters = data.filters;

    if (filters) {
        // Filters for the filters that have a value, 
        // changed into the format of key in (values) and joins them in an and 
        query_filters = Object.entries(filters)
        // .filter(([key, value]) => value.length || key !== 'assigned')
        .filter(([key, value]) => value.length && key !== 'assigned')
        .map(([key, value]) => `${key} in (${value.map(word => `'${word}'`).join(',')})`)
        .join(' and ');
    }
    
    // ----------- Building the final query -----------
    // If either of the activated arguments or the filters are not empty then we want to add a where to the query
    if ( query_activated.length || query_filters.length  || query_unassigned.length) {
        query += ` WHERE `
    }

    // Add the activated arguments to the query
    query += query_activated

    if ( query_activated.length && query_filters.length ) {
        query += ` and `
    }

    // Add the filter arguments to the query 
    query += query_filters

    if ( (query_activated.length && query_unassigned.length) || (query_filters.length && query_unassigned.length)) {
        query += ` and `
    }

    // Add the unassigned argument to the query
    query += query_unassigned


    // Add the limit and offset to the query
    if (data.limit) {
        query += ' LIMIT ? '
        activated.push(data.limit)
    }

    if (data.offset) {
        query += ' OFFSET ? '
        activated.push(data.offset)
    }

    // ----------- Printing the final query -----------
    // console.log(query)

    try {
        stmt = betterDb.prepare(query)
        if (activated.length) {
            device = stmt.all(activated);
        }
        else {
            device = stmt.all();
        }

    } catch (err) {
        console.log(query, err)
        callback(err, null)
    }
    callback(null, device);


}

/**
 * 
 * @param {*} data : Json file that consists of the following parameters  
 * @param {*} data.source : The table we want to get information out of (not optional)
 * @param {*} data.attribute : The attribute we want to focus on (not optional)
 * @param {*} data.limit : The limit of the number of results we want to get (optional)
 * @param {*} data.offset : The offset of the results we want to get (optional)
 * 
 * @param {*} callback 
 */
exports.getAllAttributes= (data, callback) =>  {
    let stmt, result;
    let query = `Select distinct`

    let list = []

    query += ` ${data.attribute} as name from ${data.source}`

    query += ` where ${data.attribute} is not null` 
    query += ` order by ${data.attribute} asc`

    if (data.limit) {
        query += ' LIMIT ?'
        list.push(data.limit)
    }

    if (data.offset) {
        query += ' OFFSET ?'
        list.push(data.offset)
    }
    

    try {
        stmt = betterDb.prepare(query)
        result = stmt.all(list);
    } catch (err) {
        callback(err, null)
    }
    callback(null, result);
}

/**
 * 
 * @param {*} data : Json file that consists of the following parameters 
 * @param {*} data.id : The id of the user we want to check if exists (not optional)
 * @param {*} callback 
 */
exports.checkIfUserExists= (data, callback) =>  {
    const stmt = betterDb.prepare('Select * from USER where u_id = ? ')
    let user;
    let id = data.id;
    try {
        user = stmt.get(id)
        if (user) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
    catch (err) {
        callback(err, null)
    }
}

/**
 * 
 * @param {*} data : Json file that consists of the following parameters
 * @param {*} data.id : The id of the user we want to get the details of (not optional)
 * @param {*} callback 
 */
exports.userDetails= (data, callback) =>  {
    let id = data.id
    let query = `Select * from USER where u_id = ? `

    const stmt = betterDb.prepare(query)
    let user;
    try {
        user = stmt.get(id)
        callback(null, user)
    }
    catch (err) {
        callback(err, null)
    }
}

/**
 * @param {*} data : Json file that consists of the following parameters 
 * @param {*} data.id : The id of the user we want to check if exists (not optional) 
 * @param {*} data.password : The password of the user we want to check if exists (not optional)
 * @param {*} callback 
 */
exports.checkUser= (data, callback) =>  {
    let user;
    let id = data.id;
    let password = data.password;

    try {
        const stmt = betterDb.prepare('Select * from USER where u_id = ?')
        user = stmt.get(id)
        if (user) {
            const match = bcrypt.compareSync(password, user.password);
            if (match) {
                callback(null, user)
            }
            else {
                callback('Wrong Password', null)
            }
        } else {
            callback('User not found', null)
        }
    }
    catch (err) {
        callback(err, null)
    }
}

/**
 * 
 * Returns the information of the latest assigned device that the user is still using 
 * 
 * @param {*} data 
 * @param {*} data.device
 * @param {*} data.id 
 * @param {*} callback 
 */
exports.getActiveAssignedDeviceData=(data,callback) => {
    data["query"] = `Select A.device_id, P.date, P.time`
    let device_data = []

    if (data.device==="Asset tracking"){
        device_data.push(`, P.longitude, P.latitude`)
        device_data.push(` Tracked`)
    } else if (data.device==="Buttons") {
        device_data.push(`, P.event`)
        device_data.push(` Pressed`)
    } else {
        callback('Device not Specified', null)
    }

    data["query"] += `${device_data[0]} from Assigned as A join ${device_data[1]} as P on P.device_id=A.device_id  where P.date >= A.date_received `
    
    if (data.status === "current"){
        data["query"] += `and ( A.date_returned IS NULL )`
    } else {
        data["query"] += `and ( A.date_returned <= P.date )`
    }
        
    if (data.id){
        data["query"] += ` and A.user_id = ?`
        data["arguments"] = [data.id]
    }

    this.select(data,callback)
}

exports.getAllActiveUsers = (data, callback) => {
    data["query"] = `SELECT 
    u_id, first_name, last_name,A1.device_id as tracker, A2.device_id as button, role 
    FROM 
    Assigned as A1 join USER 
    on A1.user_id=u_id
    join Assigned as A2 
    on A2.user_id = A1.user_id 
    where 
    A1.user_id = A2.user_id
    and
    A1.date_received=A2.date_received
    and 
    tracker !=button
    and 
    (Select type from DEVICE where d_id=tracker)='Asset tracking'
    and 
    A1.date_returned IS NULL `
    
    this.select(data, callback)
}

// ---------- Functions to be optimized later -----------


exports.getAssignedDates = (data, callback ) => {
    data["query"] = ` Select  DISTINCT A.date_received from Assigned as A `

    if (data.status){
        data["query"] += ` where `
    }

    if (data.status === "current"){
        data["query"] += ` date_returned IS NULL `
    } else if (data.status === "past") { 
        data["query"] = ` date_returned IS NOT NULL`
    } 

    if (data.status) {
        data["query"] += ` and `
    }

    if (data.id){
        data["query"] += ` user_id = ? `   
        data["arguments"] = [data.id]
    }

    this.select(data, callback)
    }




// --------- Static Selection in the database -----------

/**
 * 
 * @param {*} data 
 * @param {*} data.query (not optional)
 * @param {*} data.arguments (optional)
 * @param {*} callback 
 */
exports.select=(data, callback) =>  {
    let stmt, result;
    try {
        stmt = betterDb.prepare(data.query)

        if (data.arguments && data.arguments.length) {
            result = stmt.all(...data.arguments);
        }
        else {
            result = stmt.all();
        }
    } catch (err) {
        callback(err, null)
    }
    callback(null, result);
}

/**
 * 
 * @param {*} data 
 * @param {*} data.query 
 * @param {*} data.arguments
 * @param {*} callback 
 */
exports.insert = (data,callback) => {
    let stmt, result;
    try {
        stmt = betterDb.prepare(data.query)
        if (data.arguments.length) {
            result = stmt.run(data.arguments);
        }
        else {
            result = stmt.run();
        }
    } catch (err) {
        callback(err, null)
    }
    callback(null, result);
}


// --------- Dynamic Insertion into Database --------

/**
 * 
 * @param {*} data 
 * @param {*} data.user 
 * @param {*} callback 
 */
exports.addUser= (data, callback) =>  {
    let user = data.user
    let attributes = [user.first_name, user.last_name, user.phone, user.role, bcrypt.hashSync(user.psw, 10)]
    let attibutes_name = ['first_name', 'last_name', 'phone', 'role', 'password']
    
    let query = `Insert into USER (${attibutes_name.join(',')}) values (${attibutes_name.map(() => '?').join(', ')})`
    const stmt = betterDb.prepare(query)

    try {
        stmt.run(attributes)
        callback(null, true)
    }
    catch (err) {
        callback(err, null)
    }
}

// ----------------------------------------------------


