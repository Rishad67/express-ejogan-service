
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
    db.query("SELECT "+ project +" FROM ej_client WHERE "+ query,(err,clients) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        if(clients.length < 1)
            return cb(clients);

        let clientIds = [];
        clients.forEach(c => {
            clientIds.push(c.id);
        });
        db.query("SELECT id,clientId,description,contactNo,contactNo2 FROM ej_location WHERE clientId IN (?) ORDER BY clientId",[clientIds], (err,locations) => {
            if(err) {
                console.log(err);
                resData.errorMessage.fatalError = "Something went wrong!!";
                return res.json(resData);
            }
            clients.forEach(client => {
                client.locations = [];
            });

            let i = 0;
            let currentClientIndex = 0;
            while(i < locations.length) {
                if(locations[i].clientId === clients[currentClientIndex].id) {
                    locations[i].clientId = undefined;
                    clients[currentClientIndex].locations.push(locations[i]);
                    i++;
                }
                else {
                    currentClientIndex++;
                }
            }
            cb(clients);
        });
    });
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

