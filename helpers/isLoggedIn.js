
const accessTokenManager = require('./accessToken');
const userModel = require('../models/userModel');
const validator = require('./validationHelper');

const isLoggedIn = (req,res,resData,userFields,cb) => {
    var decoded = accessTokenManager.verifyAccessToken(req.body.accessToken);
    if(!decoded || !validator.isPositiveNumber(decoded.userId) || !decoded.sessionId) {
        resData.errorMessage.fatalError = 'Invalid request';
        return res.json(resData);
    }

    console.log(req.session.id);
    console.log(decoded.sessionId);
    if(decoded.sessionId !== req.session.id) {
        resData.errorMessage.authError = true;
        return res.json(resData);
    }
    if(!userFields)
        userFields = "id";

    userModel.getDetails(res,resData,"id="+ decoded.userId,userFields,(user) => {
        if(!user) {
            resData.errorMessage.authError = true;
            return res.json(resData);
        }

        cb(user);
    });
};

module.exports = isLoggedIn;