
const db = require('../db/connection');

const role = {
    schemas: [
        "CREATE TABLE IF NOT EXISTS ej_role(\
            id int AUTO_INCREMENT PRIMARY KEY,\
            name VARCHAR(255),\
            description VARCHAR(255)\
        );",
        "CREATE TABLE IF NOT EXISTS ej_role_permission(\
            roleId int FOREIGN KEY REFERENCES ej_role(id),\
            permissionId int FOREIGN KEY REFERENCES ej_permission(id)\
        );"
    ]
};

role.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_role SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

role.assignPermission = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_role_permission SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
}

role.removePermission = (res,resData,data,cb) => {
    db.query("DELETE FROM ej_role_permission WHERE ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
}

role.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_role SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

role.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_role WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = role;

