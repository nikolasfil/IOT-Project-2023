const express = require('express');
const app = express();
const session = require('express-session');

// const expbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const sqliteStore = require('connect-sqlite3')(session) //store for session


// Either use the port number from the environment or use 8080
// Careful I may need to change this one 
const port = process.env.PORT || 7080;

// handle urls 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// using css,javascript, images and other public files 
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/controllers', express.static(`${__dirname}/controllers/`));


app.use(session({
    secret: process.env.secret || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // httpOnly: true,
        sameSite: true,
        // cookie age is 2 hours
        maxAge: 2*60*60*1000
    },
    store: new sqliteStore({db: 'session.sqlite',dir: './model/sessions'})
}))




app.use(require('./routes/route_database.js'));



// final command to have the server running
app.listen(port,'0.0.0.0' ,() => {
    console.log('Server listening on port ' + port);
});




