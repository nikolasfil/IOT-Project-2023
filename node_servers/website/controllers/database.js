require('dotenv').config();


/**
 * Connects to the database server that is specified in the .env file. 
 *  
 * @param {*} route The link that specifies the request for the database 
 * @param {*} data A json object that contains the data that is going to be sent to the database
 * @param {*} callback The function that handles the result
 * @returns the response of the request from the database
 */
async function fetchResponse(route, data, callback){
    
    let link = `http://${process.env.DBURL}:7080` + route
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
 * @param {*} link 
 * @param {*} data 
 * @param {*} callback 
 */
exports.databaseRequest= (link, data, callback) =>  {

    fetchResponse(link, data,(err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, data)
        }
    });
}
