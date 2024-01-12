const sql = require('better-sqlite3')
const betterDb = new sql('model/database.sqlite')

const bcrypt = require('bcrypt');


function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}


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



module.exports = {

    addingActivated: function(activated_name, linker, regex) {
        let query_activated ;
        
        console.log(regex)
        if (!regex){
            query_activated = activated_name.map((name) => `${name} = ?`).join(linker)
        }
        else {
            let searchable = [] ;
    
            this.getAllDevicesJson(data={linker:'or', regex:false}, function(err, rows) {
                searchable.push(rows.map(row => row.serial));
                searchable.push(rows.map(row => row.id));
                // searchable.push(rows.map(row => row.user));
            })
            query_activated = activated_name.map(
                (name) => `${name} in (${getRegex(name, searchable).map(word => `'${word}'`).join(',')})`
                ).join(linker)
        }    
        return query_activated
    },
    
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
    getAllDevicesJson: function (data,  callback) {
        

        // Defining the variables
        let stmt, device, query, query_filters, query_activated, linker;
        
        // initializing some variables
        query_filters = "";
        query_activated = "";
        
        // ----------- initializing arguments -----------

        // Assigning value to the linker
        if (!data.exclusively) {
            linker = ' or '
        }else {
            linker = ' and '
        }

        // Working on the arguments provided
        let activated = []; 
        let activated_name = [];

        // List of arguments that are not iterated
        let non_iterated = ['filters', 'limit', 'offset', 'numOf','exclusively', 'linker','regex','assigned']


        // ----------- Changing the ambigues column --------------

        if (data.assigned){
            data['DEVICE.id'] = data.id
            delete data.id
            data['USER.id'] = data.user 
            delete data.user
        }

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

        query = ` Select * `

        if (data.numOf) {
            // If the numOf is true then it will return the number of results
            query = `Select COUNT(*) as count_result`
        } else if (data.assigned){
            // Else it will return all the fields 
            query = `Select DEVICE.id , serial, battery, status, type, USER.id as user, first_name, last_name, phone, date_received, date_returned `
        } 


        // Add the table name
        query += ` FROM DEVICE `
        
        if (data.assigned) {
            query += ` JOIN Assigned on DEVICE.id = Assigned.device_id JOIN USER on Assigned.user_id = USER.id`
        }


        // ----------- Building the activated arguments -----------

        
        // query_activated = activated_name.map((name) => `${name} = ?`).join(linker)
        query_activated = this.addingActivated(activated_name, linker, data.regex)
        

        // ----------- Building the filters -----------

        let filters = data.filters;

        if (filters) {
            // Filters for the filters that have a value, changed into the format of key in (values) and joins them in an and 
            query_filters = Object.entries(filters)
            .filter(([key, value]) => value.length)
            .map(([key, value]) => `${key} in (${value.map(word => `'${word}'`).join(',')})`)
            .join(' and ');
        }
        
        // ----------- Building the final query -----------
        if ( query_activated.length || query_filters.length  ) {
            query += ` WHERE `
        }

        // Add the activated arguments to the query
        query += query_activated

        // Add the filter arguments to the query 
        query += query_filters

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
        console.log(query)

        try {
            stmt = betterDb.prepare(query)
            if (activated.length) {
                device = stmt.all(activated);
            }
            else {
                device = stmt.all();
            }

        } catch (err) {
            console.log(query)
            callback(err, null)
        }
        callback(null, device);


    },

    select: function(command, callback) {
        let stmt, result;
        try {
            stmt = betterDb.prepare(command)
            result = stmt.all();
        } catch (err) {
            callback(err, null)
        }
        callback(null, result);
    },


    getAllAtributes: function(source,attribute, limit, offset, callback) {
        let stmt, result;
        let query = `Select distinct`

        let list = []

        query += ` ${attribute} as name from ${source}`

        query += ` where ${attribute} is not null` 
        query += ` order by ${attribute} asc`

        if (limit) {
            query += ' LIMIT ?'
            list.push(limit)
        }

        // if (offset) {
        //     query += ' OFFSET ?'
        //     list.push(offset)
        // }
        

        try {
            stmt = betterDb.prepare(query)
            result = stmt.all(list);
        } catch (err) {
            callback(err, null)
        }
        callback(null, result);
    },


    checkIfUserExists: function (id, callback) {
        const stmt = betterDb.prepare('Select * from USER where id = ? ')
        let user;
        try {
            user = stmt.get(id)
            callback(null, user)
        }
        catch (err) {
            callback(err, null)
        }
    },

    userDetails: function (id, callback) {
        const stmt = betterDb.prepare('Select id, first_name, last_name, phone,role from USER where id = ? ')
        let user;
        try {
            user = stmt.get(id)
            // console.log(id)
            callback(null, user)
        }
        catch (err) {
            callback(err, null)
        }
    },

    checkUser: function (id, password, callback) {

        let user, error_message;

        try {
            const stmt = betterDb.prepare('Select * from USER where id = ?')
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
    },

    addUser: function (user, callback) {
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
    },



    

}