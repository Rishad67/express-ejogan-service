
const db = require('../db/connection');

const permission = {
    schema: "CREATE TABLE IF NOT EXISTS ej_permission(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(255),\
        description VARCHAR(255)\
    );"
};

permission.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_permission SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

permission.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_permission SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

permission.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_permission WHERE " + query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

permission.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_permission WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

module.exports = permission;

