
const db = require('../db/connection');

const user = {
    schema: "CREATE TABLE IF NOT EXISTS ej_user(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(255),\
        email VARCHAR(255),\
        contactNo VARCHAR(15),\
        password VARCHAR(255),\
        role int,\
        joinedOn DATETIME NOT NULL DEFAULT NOW(),\
        nid VARCHAR(20),\
        bankAccNo VARCHAR(20)\
    );"
};

user.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_user SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        db.query("SELECT id FROM ej_user WHERE contactNo = "+data.contactNo, (err, results) => {
            if (err) {
                console.log(err);
                resData.errorMessage.fatalError = "Something went wrong!!";
                return res.json(resData);
            }
            if(results[0])
                cb(results[0].id);
            else
                cb();
        });
    });
};
 
user.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_user SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        db.query("SELECT id FROM ej_user WHERE "+ query,(err,results) => {
            if(err) {
                console.log(err);
                resData.errorMessage.fatalError = "Something went wrong!!";
                return res.json(resData);
            }
            if(results[0])
                cb(results[0].id);
            else
                cb();
        })
    });
};

user.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_user WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = user;

