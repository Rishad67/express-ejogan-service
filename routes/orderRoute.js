const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const validateOrderData = require('../validation/validateOrderData');
const isLoggedIn = require('../helpers/isLoggedIn');

router.post('/create',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        let newOrder = validateOrderData(req.body,resData.errorMessage);

        if(!newOrder)
            return res.json(resData);

        orderModel.create(res,resData,newOrder,() => {
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/details',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        let query = "id="+ req.body.id;
        orderModel.getDetails(res,resData,query,"*",(order) => {
            resData.order = order;
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/my-orders',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        orderModel.getAll(res,resData,user.id,"*",(orders) => {
            resData.orders = orders;
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post("/update",(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        let updatedOrder = validateOrderData(req.body,resData.errorMessage);

        if(!updatedOrder)
            return res.json(resData);
            
        orderModel.update(res,resData,"id="+ req.body.id,updatedOrder,() => {
            resData.success = true;
            res.json(resData);
        });
    });
});

module.exports = router;