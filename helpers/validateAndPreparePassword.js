const validator = require('../helpers/validationHelper');
const bcrypt = require('bcryptjs');
const saltRounds = 15;

const validateAndPreparePassword = (req,res,resData,cb) => {
    let msg = validator.isValidPassword(req.body.password);
    if(msg !== true) {
        resData.errorMessage.password = msg;
        return res.json(resData);
    }

    if(req.body.password !== req.body.confirmPassword) {
        resData.errorMessage.confirmPassword = "Passwords must match";
        return res.json(resData);
    }

    bcrypt.hash(req.body.password,saltRounds).then(function(hashedPassword) {
        cb(hashedPassword);
    })
    .catch(err => {
        console.log("ERROR: "+err);
        resData.errorMessage.fatalError = "Something went wrong!!";
        return res.json(resData);
    });
}

module.exports = validateAndPreparePassword;