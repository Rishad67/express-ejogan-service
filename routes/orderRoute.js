const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const validateOrderData = require('../validation/validateOrderData');
const deliveryLocationModel = require('../models/deliveryLocationModel');
const isLoggedIn = require('../helpers/isLoggedIn');

const createOrder = (res,resData,newOrder,userId) => {
    console.log(newOrder);
    orderModel.create(res,resData,newOrder,() => {
        let project = "ej_order.id as id,productDescription,createdOn,ej_client.name as client,ej_orderstate.description as status,paymentStatus,ej_orderstate.id as stateId";
        orderModel.getMyOrders(res,resData,userId,project,(orders) => {
            for(var i=0; i<orders.length; i++) {
                orders[i].paymentStatus = orders[i].paymentStatus ? "Completed" : "Due";
                orders[i].onGoing = true;
            }
            resData.orders = orders;
            resData.success = true;
            res.json(resData);
        });
    });
}

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
        console.log(resData.errorMessage);
        if(!newOrder)
            return res.json(resData);

        if(req.body.deliveryAddress) {
            req.body.deliveryAddress.creatorId = user.id;

            deliveryLocationModel.create(res,resData,req.body.deliveryAddress,(locationId) => {
                newOrder.deliveryAddressId = locationId;
                createOrder(res,resData,newOrder,user.id);
            })
        }
        else {
            createOrder(res,resData,newOrder,user.id);
        }
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
        let project = "ej_order.id,productDescription,shippingType,currentStateId,ej_order.clientId,CONCAT(parcelWeight,' ',weightUnit) as totalWeight,collectionAmount,parcelSize,cashOnDelivery,breakable,deliveryChargeDescription,ej_orderstate.description as status,paymentStatus,ej_client.name as client,createdOn,pLocation.fullAddress as pickupAddress,pLocation.id as pickupAddressId,pLocation.contactNo as plc1,pLocation.contactNo2 as plc2,dLocation.fullAddress as deliveryAddress,dLocation.id as deliveryAddressId,dLocation.contactNo as dlc1,dLocation.contactNo2 as dlc2";
        orderModel.getDetails(res,resData,req.body.id,project,(order) => {
            order.pickupAddress = {
                id: order.pickupAddressId,
                fullAddress: order.pickupAddress,
                contact: order.plc1,
                contact2: order.plc2
            }
            order.deliveryAddress = {
                id: order.deliveryAddressId,
                fullAddress: order.deliveryAddress,
                contact: order.dlc1,
                contact2: order.dlc2
            }
            order.plc1 = order.plc2 = order.dlc1 = order.dlc2 = undefined;

            order.charges = [
                {
                    type: "শিপমেন্ট চার্জ",
                    amount: 0
                },
                {
                    type: "ভঙ্গুর প্রোডাক্ট চার্জ",
                    amount: 0
                },
                {
                    type: "কালেকশন চার্জ",
                    amount: 0
                },
                {
                    type: "সর্বমোট",
                    amount: 0
                }
            ];
            order.collectionAmount = order.cashOnDelivery ? order.collectionAmount + " TK" : "0";
            order.breakable = order.breakable == 1;
            order.cashOnDelivery = order.cashOnDelivery == 1;
            order.paymentStatus = order.paymentStatus ? "Completed" : "Due";
            order.changable = order.currentStateId < 2;
            order.onGoing = true; //later
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
        let project = "ej_order.id as id,productDescription,createdOn,ej_client.name as client,ej_orderstate.description as status,paymentStatus,ej_orderstate.id as stateId";
        orderModel.getMyOrders(res,resData,user.id,project,(orders) => {
            for(var i=0; i < orders.length; i++) {
                orders[i].paymentStatus = orders[i].paymentStatus ? "Completed" : "Due";
                orders[i].onGoing = true;
            }
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