
const db = require('../db/connection');

const client = {
    schema: "CREATE TABLE IF NOT EXISTS ej_client(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(255),\
        ownerId int,\
        website VARCHAR(255),\
        FOREIGN KEY (ownerId) REFERENCES ej_user(id)\
    );"
};

client.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_client SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
        cb(result.insertId);

    });
};

client.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_client SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

client.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_client WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

client.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_client WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = client;

