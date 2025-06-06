const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const deliveryLocationModel = require('../models/deliveryLocationModel');
const isLoggedIn = require('../helpers/isLoggedIn');

router.post('/fetch',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        orderModel.getByState(res,resData,req.body.state,(orders) => {
            orders.forEach(o => {
                o.pickupAddress = {
                    fullAddress: o.pickupAddress,
                    contact: o.plc1,
                    contact2: o.plc2
                }
                o.deliveryAddress = {
                    fullAddress: o.deliveryAddress,
                    contact: o.dlc1,
                    contact2: o.dlc2
                }
                o.plc1 = o.plc2 = o.dlc1 = o.dlc2 = undefined;
            });
            resData.deliveries = orders;
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
        let project = "shippingType,productDescription,collectionAmount,CONCAT(parcelWeight,' ',weightUnit) as totalWeight,parcelSize,cashOnDelivery,breakable";
        orderModel.getDeliveryDetails(res,resData,req.body.id,project,(order) => {
            order.breakable = order.breakable == 1;
            order.cashOnDelivery = order.cashOnDelivery == 1;
            order.collectionAmount = order.cashOnDelivery ? order.collectionAmount + " TK" : undefined;
            resData.order = order;
            resData.success = true;
            res.json(resData);
        });
    });
});


module.exports = router;