const db = require('./connection');

const clientModel = require('../models/clientModel');
const locationModel = require('../models/locationModel');
const orderModel = require('../models/orderModel');
const orderStateModel = require('../models/orderStateModel');
const permissionModel = require('../models/permissionModel');
const roleModel = require('../models/roleModel');
const tempUserModel = require('../models/tempUserModel');
const userModel = require('../models/userModel');

const DbAction = {};

const doAction = (queryList, index, res, resData) => {
    if(index < 0) {
        resData.success = true;
        resData.message = "Task Finished Successfully";
        return res.json(resData);
    }

    db.query(queryList[index],(err,results) => {
        if(err) {
            console.log(err);
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
        else
            doAction(queryList, index-1, res, resData);
    });
}

DbAction.createAllTables = (res,resData) => {
    let queryList = [
        ...orderModel.schemas,
        orderStateModel.schema,
        locationModel.schema,
        clientModel.schema,
        userModel.schema,
        ...roleModel.schemas,
        permissionModel.schema,
        tempUserModel.schema,
    ];
    doAction(queryList, queryList.length-1, res, resData);
}

DbAction.DropAllTables = (res,resData) => {
    let queryList = [
        "DROP TABLE IF EXISTS ej_temp_user;",
        "DROP TABLE IF EXISTS ej_permission;",
        "DROP TABLE IF EXISTS ej_role;",
        "DROP TABLE IF EXISTS ej_role_permission;",
        "DROP TABLE IF EXISTS ej_user;",
        "DROP TABLE IF EXISTS ej_client;",
        "DROP TABLE IF EXISTS ej_location;",
        "DROP TABLE IF EXISTS ej_order;",
        "DROP TABLE IF EXISTS ej_orderstate;",
        "DROP TABLE IF EXISTS ej_order_orderstate;",
    ];
    doAction(queryList, queryList.length-1, res, resData);
}



module.exports = DbAction;
