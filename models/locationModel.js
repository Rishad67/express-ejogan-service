

const db = require('../db/connection');

const location = {
    schema: "CREATE TABLE IF NOT EXISTS ej_location(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(50),\
        city VARCHAR(30),\
        thana VARCHAR(50),\
        area VARCHAR(50),\
        road VARCHAR(50),\
        house VARCHAR(20),\
        fullAddress VARCHAR(250),\
        latitude int,\
        longitude int,\
        contactNo VARCHAR(25),\
        contactNo2 VARCHAR(25),\
        clientId int,\
        FOREIGN KEY (clientId) REFERENCES ej_client(id)\
    );"
};

location.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_location SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(result.insertId);
    });
};

location.createAll = (res,resData,data,cb) => {
    if(data.length < 1)
        return cb();

    db.query("INSERT INTO ej_location(name,city,thana,area,road,house,fullAddress,latitude,longitude,contactNo,contactNo2,clientId) VALUES ?", [data], (err, results) => {
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

location.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_location WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

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

location.delete = (res,resData,query,cb) => {
    db.query("DELETE FROM ej_location WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    })
}

module.exports = location;

