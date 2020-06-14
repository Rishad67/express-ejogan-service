const express = require("express");
const cors = require('cors');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

const bodyParser = require('body-parser');
const db = require('./db/connection');

const sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'USERS_SESSIONS',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

const orderRoute = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");
const accountRoute = require("./routes/accountRoute");

app.use('/api/order',orderRoute);
app.use('/api/admin',adminRoute);
app.use('/api/account',accountRoute);

app.get("/",(req,res) => {
    res.send("<h1> Welcome to Express service of Ejogan.com </h1>");
});

app.listen("9000",() => {
    console.log("Server is running at port: 9000");
});