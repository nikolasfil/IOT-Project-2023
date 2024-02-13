const sql = require('better-sqlite3')
const betterDb = new sql('model/database.sqlite')

const bcrypt = require('bcrypt');
const { query } = require('express');


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
    let query, query_filters, query_activated, linker;
    
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
    let non_iterated = ['filters', 'limit', 'offset', 'numOf','exclusively', 'linker','regex','assigned','debug','single','query','arguments']

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
    } else if (!data.numOf && (data.assigned === undefined || data.assigned === null )) {
        // If the request is not for the number or results and it does not include fields, then return everything
        query += ` * `
    } 

    if (data.assigned){
        // We want specific fields to be reutrned if the request is for the assigned devices
        // Else it will return all the fields of the Assigned table so that they are joined
        query += ` d_id , serial, battery, status, type, u_id, first_name, last_name, phone, date_received, date_returned `
    } else if (data.assigned ===false) {
        query += ` distinct d_id, serial, battery, status, type`
    }


    // Add the table name
    query += ` FROM DEVICE `
    
    if (data.assigned) {
        // Join the tables we want if the request is for the assigned devices
        query += ` JOIN Assigned on d_id = device_id JOIN USER on user_id = u_id`
    } else if (data.assigned === false ){ 
        // If the request is for the unassigned devices then we want to exclude the assigned devices
        query_unassigned = `  d_id NOT IN (SELECT device_id FROM Assigned where date_received<=? and (date_returned > ? or date_returned IS NULL )) `
        activated.push(`DATE("now")`)
        activated.push(`DATE("now")`)
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

    data["query"] = query
    data["arguments"] = activated
    // console.log(data)
    this.execute(data, callback)
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
    
    data["query"] = query
    data["arguments"] = list

    this.execute(data, callback)
}


/**
 * 
 * @param {*} data 
 * @param {*} data.function The user function we want to execute (not optional) (details, login, check, add) 
 * @param {*} data.id The id of the user (not optional)
 * @param {*} data.user The user information (optional) for adding a user 
 * @param {*} data.password The password of the user (optional) for login
 * @param {*} data.status The status of the user (optional) (current, past)
 * @param {*} callback 
 */
exports.userFunctions=(data,callback)=> {
    // Keeps the default callback function
    // For details login and check we are executing the same query to the database but use a different callback_function
    if (data.function === "details" || data.function === "login" || data.function === "check") { 
        data["single"] = true
        data["query"] = `Select * from USER where u_id = ?` 
        data["arguments"] = [data.id]
    } else if (data.function === "add") { 
        // We have a different query for the add Function since it is an insert rather than a select 
        let user = data.user
        let attributes = [user.first_name, user.last_name, user.phone, user.role, bcrypt.hashSync(user.psw, 10)]
        let attibutes_name = ['first_name', 'last_name', 'phone', 'role', 'password']
        
        data["query"] = `Insert into USER (${attibutes_name.join(',')}) values (${attibutes_name.map(() => '?').join(', ')})`
        data["arguments"] = attributes
    } 
    if (data.function === "login") {
        // Checks the password provided is the same from the password retrieved from the database 
        const login_checker = (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                if (result) {
                    const match = bcrypt.compareSync(data.password, result.password);
                    if (match) {
                        callback(null, result)
                    }
                    else {
                        callback("Wrong Password", result)
                    }
                } else {
                    callback("User Not Found", false)
                }
            }
        }
        // Assigns the new callback function 
        // callback_function = login_checker
        this.execute(data, login_checker)


    } else if (data.function === "check"){
        // Checks if the user exists in the database, returns only true of false 
        const existence_checker = (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                if (result) {
                    callback(null, true)
                } else {
                    callback(null, false)
                }
            }
        }
        // callback_function = existence_checker
        this.execute(data, existence_checker)
    } else {
        this.execute(data, callback)
    }
}


/**
 * 
 * Returns the information of the latest assigned device that the user is still using 
 * 
 * @param {*} data 
 * @param {*} data.type
 * @param {*} data.id 
 * @param {*} callback 
 */
exports.getActiveAssignedDeviceData=(data,callback) => {


    data["query"] = `Select d_id, serial, status, battery, type `
        
    let device_data = []
    
    data["query"] += `, P.date, P.time`
    if (data.type==="Asset tracking"){
        device_data.push(`, P.longitude, P.latitude`)
        device_data.push(` Tracked`)
        
    } else if (data.type==="Buttons") {
        device_data.push(`, P.event`)
        device_data.push(` Pressed`)
    } else {
        callback('Device not Specified', null)
    }
    data["query"] += `${device_data[0]} `
    
    if (data.assigned ){
    data["query"] += ` from DEVICE join Assigned as A on d_id = A.device_id `
    } else {
        data["query"] += ` from DEVICE `
    }
    
    // if (data.) // check for extra data 
    data["query"] += `join ${device_data[1]} as P on P.device_id=d_id `
    
    data["query"]+=` where `
    
    data["query"]+=`P.date >= A.date_received `
    
    if (data.time_status === "current"){
        data["query"] += `and ( A.date_returned IS NULL )`
    } else if (data.time_status === "past"){
        data["query"] += `and ( A.date_returned <= P.date )`
    } 
    
    data["arguments"] = [] 


    if (data.id || data.assigned){
        data["query"] += ` and A.user_id = ?`
        data["arguments"].push(data.id)
    }

    if (data.d_id) {
        data["query"] += ` and d_id = ?`
        data["arguments"].push(data.d_id)
    }

    if (data.date) {
        data["query"] += ` and P.date = ?`
        data["arguments"].push(data.date)
    }
    this.execute(data,callback)
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
    
    this.execute(data, callback)
}

// ---------- Functions to be optimized later -----------


exports.getAssignedDates = (data, callback ) => {
    data["query"] = ` Select  DISTINCT A.date_received from Assigned as A `

    if (data.time_status){
        data["query"] += ` where `
    }

    if (data.time_status === "current"){
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

    this.execute(data, callback)
    }

// --------- Static Selection in the database -----------

/**
 * 
 * @param {*} data 
 * @param {*} data.query (not optional)
 * @param {*} data.arguments (optional)
 * @param {*} callback 
 */
exports.execute=(data, callback) =>  {

    let stmt, result;
    try {
        stmt = betterDb.prepare(data.query)
        if (data.arguments && data.arguments.length && (data.single === undefined || data.single === null || data.single === false) ) {
            result = stmt.all(data.arguments);
        } else if (data.arguments && data.arguments.length && data.single) {
            result = stmt.get(data.arguments);
        } else {
            result = stmt.all();
        }
        if (result === undefined) {
            result = null
        }
        callback(null, result);
    } catch (err) {
        callback(err, null)
    }
}



// --------- Dynamic Insertion into Database --------


// ----------------------------------------------------

/**
 * 
 * Can return information about a device, assignment information and event information (Track or Presses )
 * Created the data.query and data.arguments for the insert function
 * 
 * @param {*} data 
 * @param {*} data.u_id (not optional)
 * @param {*} data.d_id (optional)
 * @param {*} data.date_received (optional)
 * @param {*} data.linker (optional)
 * @param {*} data.assigned
 * @param {*} callback 
 */
exports.getDeviceData= (data, callback)=>{
    // get the device data 
    // get assigned data of the device 
    // get event data of the device 
    let query_activated = [] 
    let fields_activated = []
    

    // Initialize the query
    data["query"] = `SELECT `
    fields_activated.push(`DEVICE.*`)

    
    if (data.assigned) {
        fields_activated.push(`A.*`)
    } 

    if (data.event){
        fields_activated.push(`P.*`)
    }

    if (data.event && data.type === "Asset tracking") {
        fields_activated.push([`P.date`,`P.time`,`P.longitude`,`P.latitude`])
        let event_table = ` Tracked as P ` 
    } else if (data.event && data.type === "Buttons") {
        fields_activated.push([`P.date`,`P.time`,`P.event`])
        let event_table = ` Pressed as P `
    }

    // if (fields_activated.length){
    data["query"] += fields_activated.join(',')
    

    // Add the basic table name
    data["query"] += ` FROM DEVICE ` 

    // Add extra table names 
    if (data.assigned) {
        data["query"]+= ` JOIN Assigned as A on d_id = A.device_id `
    }

    if (data.event && event_table) {
        data["query"]+= ` JOIN ${event_table} on P.device_id=d_id `
    }

    // Check the arguments provided and add them to the query

    data["arguments"] = []

    if (data.assigned){

        if (data.time_status === "past") {
            query_activated.push(`A.date_returned IS NOT NULL `)
        } else if (data.time_status === "current") {
            query_activated.push(`A.date_returned IS NULL `)
        }
        
        if (data.user_id ){
            query_activated.push("A.user_id = ? ")
            data["arguments"].push(data.user_id)
        }

        if (data.date_received) {
            query_activated.push("A.date_received = ? ")
            data["arguments"].push(data.date_received)
        }
    }

    if (data.event && event_table) {
        query_activated.push(`P.date >= A.date_received `)
        if (data.time_status === "past") {
            query_activated.push(`A.date_returned <= P.date `)
        }
    }

    if (data.d_id){
        query_activated.push("d_id = ? ")
        data["arguments"].push(data.d_id)
    }
    

    if (data.linker === undefined || data.linker === null) {
        data.linker = ' and '
    }
    
    if (query_activated.length){
        data ["query"] += ` WHERE `;
        data["query"] += query_activated.join(data.linker)
    }

    console.log(data)
    this.execute(data, callback)

}
