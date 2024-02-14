require('dotenv').config();


fetchResponse = (link,link_data,callback)=> {
    let response = fetch(link, link_data).then((res) => {
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
 * Connects to the database server that is specified in the .env file. 
 *  
 * @param {*} route The link that specifies the request for the database 
 * @param {*} data A json object that contains the data that is going to be sent to the database
 * @param {*} callback The function that handles the result
 * @returns the response of the request from the database
 */
function dbCom(route, data, callback){
    
    let link = `http://${process.env.DBURL}:7080` + route

    let link_data = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({data:data}),        
    }

    let response = fetchResponse(link,link_data,callback)
    return response

}

/**
 * 
 * @param {*} link 
 * @param {*} data 
 * @param {*} callback 
 */
exports.databaseRequest= (link, data, callback) =>  {
    dbCom(link, data,callback);
}


exports.contextProvider = ( data, callback) => {
    let link = `http://${process.env.CPURL}/v2/entities/${data.serial}`
    console.log(link)
    let link_data = { 
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    }
    fetchResponse(link, link_data, callback)
}


