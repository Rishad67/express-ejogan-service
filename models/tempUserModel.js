
const db = require('../db/connection');

const tempUser = {
    schema: "CREATE TABLE IF NOT EXISTS ej_temp_user(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        contactNo VARCHAR(15),\
        tempSessionId VARCHAR(50),\
        otp int,\
        otpTrials int DEFAULT 0,\
        lastOtpSendTime DATETIME NOT NULL DEFAULT NOW(),\
        createdOn DATETIME NOT NULL DEFAULT NOW()\
    );"
};

tempUser.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_temp_user SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
        db.query("SELECT id FROM ej_temp_user WHERE contactNo = "+data.contactNo, (err, results) => {
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

tempUser.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_temp_user SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

tempUser.delete = (res,resData,query,cb) => {
    db.query("DELETE FROM ej_temp_user WHERE "+ query, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
        cb();
    });
};

tempUser.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_temp_user WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = tempUser;