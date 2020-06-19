

const db = require('../db/connection');

const deliveryLocation = {
    schema: "CREATE TABLE IF NOT EXISTS ej_delivery_location(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(50),\
        city VARCHAR(30),\
        thana VARCHAR(50),\
        area VARCHAR(50),\
        road VARCHAR(50),\
        house VARCHAR(20),\
        description VARCHAR(250),\
        latitude int,\
        longitude int,\
        contactNo VARCHAR(255),\
        creatorId int,\
        FOREIGN KEY (creatorId) REFERENCES ej_user(id)\
    );"
};

deliveryLocation.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_delivery_location SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(result.insertId);
    });
};

deliveryLocation.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_delivery_location SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

deliveryLocation.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_delivery_location WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

deliveryLocation.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_delivery_location WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = deliveryLocation;

