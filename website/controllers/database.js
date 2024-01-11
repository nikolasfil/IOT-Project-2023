const sql = require('better-sqlite3')
const betterDb = new sql('model/database.sqlite')

const bcrypt = require('bcrypt');
const { query } = require('express');

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}


function getRegex(title) {

    let rows;
    try {
        rows = betterDb.prepare('Select title from BOOK').all()

    } catch (err) {
        throw err;
    }

    const commonWords = [
        'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I']

    title = title.trim();
    const words = title.split(" ");

    const partialWords = words.filter(word => !commonWords.includes(word));

    const partialPattern = partialWords.map(word => `(?:\\b|\\B)${escapeRegExp(word)}\\w*(?:\\b|\\B)`).join('|');

    const exactPattern = `\\b${escapeRegExp(title)}\\b`;

    const pattern = `(?:${partialPattern}|${exactPattern})`;

    const matchingPhrases = rows.filter(row => new RegExp(pattern, 'i').test(row.title)).map(row => row.title);

    return matchingPhrases;

}


module.exports = {

    
    /**
     * Returns information about the device . Every option other than callback is optional , if no option is given it will return all the devices
     * @param {*} id For a specific device (optional)
     * @param {*} serial For a specific serial (optional)
     * @param {*} battery For a specific battery (optional)
     * @param {*} status For a specific status (optional)
     * @param {*} type For a specific type (optional)
     * @param {*} limit Limiting the number of results (optional)
     * @param {*} offset Starting from a specific result (optional)
     * @param {*} numOf true or null, if we want to focus more on the number of results back
     * @param {*} callback function that handles the results
     *  
     */
    getAllDevices: function (id, serial, battery, status, type,limit, offset,numOf,  callback) {
        
        let stmt, device;

        let query = `Select *`
        
        if (numOf) {
            query = `Select COUNT(*) as count_result`
        }

        query += ` FROM DEVICE`

        let list = [id, serial, battery, status, type]
        let list_name = ['id', 'serial', 'battery', 'status', 'type']
        let activated = []; 
        let activated_name = [];

        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                activated.push(list[i])
                activated_name.push(list_name[i])
            }
        }

        if (activated.length) {
            query += ` where ${activated_name[0]} = ?`
        }



        for (let i=1; i<activated.length; i++) {
            query += ` and ${activated_name[i]} = ?`
        }

      
        if (limit) {
            query += ' LIMIT ?'
            activated.push(limit)
            
        }

        if (offset) {
            query += ' OFFSET ?'
            activated.push(offset)
        }
        
        try {
            stmt = betterDb.prepare(query)
            if (activated.length) {
                device = stmt.all(activated);
            }
            else {
                device = stmt.all();
            }

        } catch (err) {
            callback(err, null)
        }

        callback(null, device);


    },
    


    getAllAtributes: function(source,attribute, limit, offset, callback) {
        let stmt, result;
        let query = `Select distinct`

        let list = []

        query += ` ${attribute} as name from ${source}`

        // switch (source) {
        //     case 'device':
        //         query += ` ${attribute} from DEVICE`
        //         break;
        //     default:
        //         callback('Wrong source', null)
        //         break;
        // }

        query += ` where ${attribute} is not null` 
        query += ` order by ${attribute} asc`

        if (limit) {
            query += ' LIMIT ?'
            list.push(limit)
        }

    
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
            console.log(id)
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
        const stmt = betterDb.prepare('Insert into USER (fname,lname,email,birthdate,password) values (?,?,?,?,?)')

        try {
            stmt.run(user.fname, user.lname, user.email, user.birthdate, bcrypt.hashSync(user.psw, 10))
            callback(null, true)
        }
        catch (err) {
            callback(err, null)
        }
    },
    

}