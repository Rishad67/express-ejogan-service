
const db = require('../db/connection');

const contactUs = {
    schema: "CREATE TABLE IF NOT EXISTS ej_contact_us(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        question TEXT,\
        userId int,\
        replyMessageId int,\
        replied int DEFAULT 0,\
        FOREIGN KEY (userId) REFERENCES ej_user(id),\
        FOREIGN KEY (replyMessageId) REFERENCES ej_message(id) \
    );"
};

contactUs.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_contact_us SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

contactUs.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_contact_us WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = contactUs;