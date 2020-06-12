
const db = require('../db/connection');

const client = {
    schema: "CREATE TABLE IF NOT EXISTS ej_client(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        organization VARCHAR(255),\
        owner int,\
        websiteUrl VARCHAR(255)\
    );"
};

client.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_client SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
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

