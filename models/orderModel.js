
const db = require('../db/connection');
const { query } = require('express');

const order = {
    schemas: [
        "CREATE TABLE IF NOT EXISTS ej_order_orderstate(\
            orderId int,\
            stateId int,\
            date DATETIME NOT NULL DEFAULT NOW(),\
            deliveryPersonId int,\
            FOREIGN KEY (deliveryPersonId) REFERENCES ej_user(id),\
            FOREIGN KEY (orderId) REFERENCES ej_order(id),\
            FOREIGN KEY (stateId) REFERENCES ej_orderstate(id)\
        );",
        "CREATE TABLE IF NOT EXISTS ej_order(\
            id int AUTO_INCREMENT PRIMARY KEY,\
            shippingType VARCHAR(25),\
            description TEXT,\
            totalPrice int,\
            parcelWeight int,\
            parcelSize int,\
            cashOnDelivery int,\
            breakable int,\
            deliveryAddressId int,\
            deliveryPersonId int,\
            clientId int,\
            pickupLocationId int,\
            createdOn DATETIME NOT NULL DEFAULT NOW(),\
            deliveryCharge int,\
            paymentStatus int DEFAULT 0,\
            deliveryChargeReceived int DEFAULT 0,\
            paymentAccountNo VARCHAR(20),\
            paymentDate DATETIME,\
            transactionNo Text,\
            rating int DEFAULT 0,\
            currentStateId int,\
            FOREIGN KEY (deliveryAddressId) REFERENCES ej_location(id),\
            FOREIGN KEY (deliveryPersonId) REFERENCES ej_user(id),\
            FOREIGN KEY (clientId) REFERENCES ej_client(id),\
            FOREIGN KEY (pickupLocationId) REFERENCES ej_location(id),\
            FOREIGN KEY (currentStateId) REFERENCES ej_orderstate(id)\
        );",
    ]
};

order.create = (res,resData,data,cb) => {
    data.currentStateId = 1;
    db.query("INSERT INTO ej_order SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
        db.query("INSERT INTO ej_order_orderstate SET ?", {orderId: result.insertId,stateId: 1}, (err, result) => {
            if (err) {
                console.log(err);
                resData.errorMessage.fatalError = "Something went wrong!!";
                return res.json(resData);
            }

            cb();
        });
    });
};

order.update = (res,resData,query,updatedData,cb) => {
    db.query("UPDATE ej_order SET ?  WHERE "+ query, updatedData, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
};

order.updateState = (res,resData,orderId,data,cb) => {
    db.query("INSERT INTO ej_order_orderstate SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
    });
}

order.getByState = (res,resData,stateId,cb) => {
    let query = "SELECT ej_order.id,ej_client.name,createdOn,pLocation.description as pickupAddress,dLocation.description as deliveryAddress FROM ej_order INNER JOIN ej_client ON ej_order.clientId = ej_client.id INNER JOIN ej_location as pLocation ON ej_order.pickupLocationId = pLocation.id  INNER JOIN ej_location as dLocation ON ej_order.deliveryAddressId = dLocation.id WHERE currentStateId="+ stateId +" ORDER BY createdOn DESC";
    db.query(query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

order.getMyOrders = (res,resData,userId,project,cb) => {
    let query = "SELECT "+ project +" FROM ej_order INNER JOIN ej_client ON ej_order.clientId = ej_client.id  INNER JOIN ej_orderstate ON ej_order.currentStateId = ej_orderstate.id WHERE ownerId="+ userId +" ORDER BY createdOn DESC";
    db.query(query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results);
    })
}

order.getDetails = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_order WHERE "+ query,(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb(results[0]);
    })
}

module.exports = order;

