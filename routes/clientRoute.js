const express = require('express');
const router = express.Router();
const clientModel = require('../models/clientModel');
const locationModel = require('../models/locationModel');
const validateClientData = require('../validation/validateClientData');
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

    isLoggedIn(req,res,resData,"id",(user) => {
        let newClient = validateClientData(req.body,resData.errorMessage);

        if(!newClient)
            return res.json(resData);

        newClient.ownerId = user.id;
        clientModel.create(res,resData,newClient,(clientId) => {
            req.body.locations.forEach(item => {
                item.push(clientId);
            })
            locationModel.createAll(res,resData,req.body.locations,() => {
                clientModel.getAll(res,resData,"ownerId="+ user.id,"id,name,website",(clients) => {
                    resData.clients = clients;
                    resData.success = true;
                    res.json(resData);
                });
            });
        });
    });
});

router.post('/my-clients',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };
    isLoggedIn(req,res,resData,"id",(user) => {
        clientModel.getAll(res,resData,"ownerId="+ user.id,"id,name,website",(clients) => {
            resData.clients = clients;
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/attach-location',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        let newLocation = validateLocationData(req.body.location,resData.errorMessage);
        if(!newLocation)
            return res.json(resData);

        newLocation.clientId = req.body.clientId;
        locationModel.create(res,resData,newLocation,(locationId) => {
            resData.locationId = locationId;
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
        clientModel.getDetails(res,resData,query,"*",(client) => {
            if(!client) {
                resData.errorMessage.fatalError = "Something went wrong!!";
                return res.json(resData);
            }
            locationModel.getAll(res,resData,"clientId="+client.id,"id,fullAddress,contactNo,contactNo2",(locations) => {
                client.locations = locations;
                resData.client = client;
                resData.success = true;
                res.json(resData);
            });
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
        let updatedClient = validateClientData(req.body,resData.errorMessage);

        if(!updatedClient)
            return res.json(resData);
            
        clientModel.update(res,resData,"id="+ req.body.id,updatedClient,() => {
            resData.success = true;
            res.json(resData);
        });
    });
});

module.exports = router;