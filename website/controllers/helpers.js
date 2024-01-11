const sqlite3 = require('sqlite3').verbose();

module.exports = {
    // use them as {{calculation value}}

    // concat function that takes arguments and concats them
    concat: function () {
        let outStr = '';
        for (let arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    },

    // encode url 
    encode: function (url) {
        return encodeURI(url);
    },

    // decode url
    decode: function (url) {
        return decodeURI(url);
    },
    

    equals: function (arg1, arg2) {
        return arg1 == arg2;
    },

    // get the book info from the database

    longtitude: function () {
        // "lon"= 23.7275390625, "lat"= 37.9838096
        // can be simplified
        // let lon = arguments[0].split(", ")[0].split(":")[1];
        let lon = arguments[0].split(",")[0];

        return lon;
    },

    latitude: function () {
        // let lat = arguments[0].split(",")[1].split(":")[1];
        let lat = arguments[0].split(",")[1];
        return lat;
    },

    workingHours: function () {
        // split arguments[0] by comma and return a list of lists split by space 
        let schedule = { "Monday": "Closed", "Tuesday": "Closed", "Wednesday": "Closed", "Thursday": "Closed", "Friday": "Closed", "Saturday": "Closed", "Sunday": "Closed" }
        let hours = arguments[0].split(",");
        let i = 0;

        for (key in schedule) {
            schedule[key] = hours[i]
            i++;
        }

        return schedule;
    }


}