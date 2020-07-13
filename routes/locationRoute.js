const express = require('express');
const router = express.Router();
const locationModel = require('../models/locationModel');
const deliveryLocationModel = require('../models/deliveryLocationModel');
const validateLocationData = require('../validation/validateLocationData');
const isLoggedIn = require('../helpers/isLoggedIn');

router.post('/my-delivery-locations',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        let query = "creatorId="+ user.id;
        if(req.body.searchKey)
            query += " AND fullAddress LIKE '%"+ req.body.searchKey +"%' LIMIT 15;";
        deliveryLocationModel.getAll(res,resData,query,"id,fullAddress,contactNo",(locations) => {
            resData.locations = locations;
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/remove',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        locationModel.delete(res,resData,"id="+req.body.locationId,() => {
            resData.success = true;
            res.json(resData);
        })
    });
});

router.post('/delivery-location-info', (req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        deliveryLocationModel.getDetails(res,resData,"id="+req.body.id,"id,fullAddress,contactNo,contactNo2",(location) => {
            resData.deliveryLocation = location;
            resData.success = true;
            res.json(resData);
        });
    });
});

module.exports = router;