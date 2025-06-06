const express = require('express');
const router = express.Router();
const isLoggedIn = require('../helpers/isLoggedIn');
const contactUsModel = require('../models/contactUsModel');

router.post('/contact-us',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    };

    isLoggedIn(req,res,resData,"id",(user) => {
        contactUsModel.create(res,resData,{userId: user.id, question: req.body.question},() => {
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/my-messages',(req,res) => {
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
/*
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
*/
module.exports = router;