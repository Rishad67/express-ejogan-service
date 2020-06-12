

const db = require('../db/connection');

const location = {
    schema: "CREATE TABLE IF NOT EXISTS ej_location(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        address VARCHAR(255),\
        latitude int,\
        longitude int,\
        contactNo VARCHAR(255),\
        clientId int\
    );"
};

location.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_location SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

location.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_location SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

location.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_location WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = location;

