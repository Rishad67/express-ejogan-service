const express = require('express');
const router = express.Router();
const locationModel = require('../models/locationModel');
const validateLocationData = require('../validation/validateLocationData');
const isLoggedIn = require('../helpers/isLoggedIn');

router.post('/create',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    let newLocations = [];
    req.body.locations.forEach(element => {
        let newLocation = validateLocationData(element,resData.errorMessage);
        newLocations.push(Object.values(newLocation));
    });
    
    //if(!newLocation)
    //    return res.json(resData);
    locationModel.createAll(res,resData,newLocations,() => {
        resData.success = true;
        res.json(resData);
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

    let query = "id="+ req.body.id;
    locationModel.getDetails(res,resData,query,"*",(location) => {
        resData.location = location;
        resData.success = true;
        res.json(resData);
    });
});

router.post('/my-locations',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        locationModel.getAll(res,resData,"1=1","*",(locations) => {
            resData.locations = locations;
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

    let updatedLocation = validateLocationData(req.body,resData.errorMessage);

    if(!updatedLocation)
        return res.json(resData);
        
    locationModel.update(res,resData,"id="+ req.body.id,updatedLocation,() => {
        resData.success = true;
        res.json(resData);
    });
});

module.exports = router;