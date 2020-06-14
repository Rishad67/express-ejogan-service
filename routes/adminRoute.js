const express = require('express');
const router = express.Router();
const DbAction = require('../db/bulkActions');

router.post('/createAllTables',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        },
        message: "Could not create all the tables"
    };
    DbAction.createAllTables(res,resData);
});

router.post('/deleteAllTables',(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        },
        message: "Could not delete all the tables"
    };
    DbAction.DropAllTables(res,resData);
});

module.exports = router;