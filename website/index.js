const express = require('express');
const app = express();
const session = require('express-session');

const expbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const sqliteStore = require('connect-sqlite3')(session) //store for session

const login = require('./controllers/login.js');

// Either use the port number from the environment or use 8080
const port = process.env.PORT || 8080;

// handle urls 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// using css,javascript, images and other public files 
app.use(express.static(path.join(__dirname, 'public')));

// app use model 
app.use('/model', express.static(`${__dirname}/model/`));
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


// helpers
const hbs = expbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    extname: '.hbs',

    // create custom helpers to be used in the handlebars files
    helpers: require('./controllers/helpers.js')
});

// using the engine of handlebars
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(login.alerting);

// specifying the routes that the user can access
app.use(require('./routes/route_about.js'));
app.use(require('./routes/route_book_info.js'));
app.use(require('./routes/route_library_info.js'));
app.use(require('./routes/route_homepage.js'));
app.use(require('./routes/route_search.js'));
app.use(require('./routes/route_sign.js'));
app.use(require('./routes/route_user_profile.js'));


// final command to have the server running
app.listen(port,'0.0.0.0' ,() => {
    console.log('Server listening on port ' + port);
});



