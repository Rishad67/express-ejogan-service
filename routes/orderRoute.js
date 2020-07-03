const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const validateOrderData = require('../validation/validateOrderData');
const deliveryLocationModel = require('../models/deliveryLocationModel');
const isLoggedIn = require('../helpers/isLoggedIn');

const createOrder = (res,resData,newOrder,userId) => {
    console.log(newOrder);
    orderModel.create(res,resData,newOrder,() => {
        let project = "ej_order.id as id,ej_order.description as description,createdOn,ej_client.name as shop,ej_orderstate.description as status,paymentStatus,ej_orderstate.description as stateId";
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

router.post('/fetch',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        orderModel.getByState(res,resData,req.body.stateId,(orders) => {
            resData.orders = orders;
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
        let project = "ej_order.id as id,ej_order.description as description,createdOn,ej_client.name as shop,ej_orderstate.description as status,paymentStatus,ej_orderstate.description as stateId";
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

router.post("/service-charge",(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    resData.charges = [
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

    resData.success = true;
    res.json(resData);

});

module.exports = router;