
const mysql = require("mysql");

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'rishad67',
    password : '*rishad67#',
    database : 'ejoganco_express_service'
});
  
db.connect(err => {
    if(err)
        console.log(err);
    else
        console.log("Database connected successfully . . .");
});

module.exports = db;