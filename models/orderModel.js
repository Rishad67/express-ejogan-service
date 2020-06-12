
const db = require('../db/connection');

const order = {
    schemas: [
        "CREATE TABLE IF NOT EXISTS ej_order(\
            id int AUTO_INCREMENT PRIMARY KEY,\
            summary VARCHAR(255),\
            description TEXT,\
            category TEXT,\
            totalPrice int,\
            parcelWeight int,\
            parcelLength int,\
            parcelWidth int,\
            parcelHeight int,\
            deliveryAddress VARCHAR(100),\
            deliveryAddressLattitude int,\
            deliveryAddressLongitude int,\
            deliveryContactNo VARCHAR(15),\
            deliveryPersonId int,\
            clientId int,\
            pickupLocation int,\
            createdOn DATETIME NOT NULL DEFAULT NOW(),\
            deliveryCharge int,\
            deliveryChargeReceived int,\
            paymentAccountNo VARCHAR(20),\
            paymentDate DATETIME,\
            transactionNo Text,\
            rating int DEFAULT 0\
        );",
        "CREATE TABLE IF NOT EXISTS ej_order_orderstate(\
            orderId int,\
            stateId int,\
            date DATETIME NOT NULL DEFAULT NOW(),\
            deliveryPersonId int\
        );"
    ]
};

order.create = (res,resData,data,cb) => {
    db.query("INSERT INTO ej_order SET ?", data, (err, result) => {
        if (err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        cb();
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

order.getAll = (res,resData,query,project,cb) => {
    db.query("SELECT "+ project +" FROM ej_order WHERE "+ query,(err,results) => {
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

