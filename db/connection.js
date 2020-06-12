
const mysql = require("mysql");

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'Rishad67',//'ejoganco_express',
    password : 'me@wordpress19',//'jzHo=VFY}$!@',
    database : 'ejoganco_express_service'
});
  
db.connect(err => {
    if(err)
        console.log(err);
    else
        console.log("Database connected successfully . . .");
});

module.exports = db;