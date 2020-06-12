
const db = require('../db/connection');

const orderState = {
    schema: "CREATE TABLE IF NOT EXISTS ej_orderstate(\
        id int AUTO_INCREMENT PRIMARY KEY,\
        description VARCHAR(255)\
    );",
};

orderState.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_orderstate SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

orderState.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_orderstate SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

orderState.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_orderstate WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

orderState.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_orderstate WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = orderState;

