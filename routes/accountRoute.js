const express = require('express');
const router = express.Router();
const tempUserModel = require('../models/tempUserModel');
const userModel = require('../models/userModel');
const sendOTP = require('../helpers/sendOTP');
const accessTokenManager = require('../helpers/accessToken');
const validateUserProfileData = require('../validation/validateUserProfileData');
const validator = require('../helpers/validationHelper');
const validateAndPreparePassword = require('../helpers/validateAndPreparePassword');
const matchPassword = require('../helpers/matchPassword');

const createTempUser = (req,res,recoverPassword) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        },
        tempAccessToken: ""
    }

    if(!validator.isValidPhoneNumber(req.body.contactNo)) {
        resData.errorMessage.contactNo = "Enter a valid phone number";
        return res.json(resData);
    }

    tempUserModel.getDetails(res,resData,"contactNo="+ req.body.contactNo,"id,contactNo,otp,tempSessionId",(tempUser) => {
        if(tempUser) {
            /*sendOTP(res,resData,tempUser.otp,() => {*/
                console.log(tempUser.otp);
                resData.tempAccessToken = accessTokenManager.generateAccessToken({tempUserId: tempUser.id,tempSessionId: tempUser.tempSessionId});
                resData.success = true;
                return res.json(resData);
            //});
        }
        else {
            userModel.getDetails(res,resData,"contactNo="+ req.body.contactNo,"*",(user) => {
                if((recoverPassword && !user) || (!recoverPassword && user)) {
                    resData.errorMessage.contactNo = "This phone number is attached to an existing account";
                    return res.json(resData);
                }

                let otp =  Math.floor(100000 + Math.random() * 900000);
                tempUserModel.create(res,resData,{
                    contactNo: req.body.contactNo,
                    tempSessionId: req.session.id,
                    otp: otp
                },
                (tempUserId) => {
                    if(!tempUserId) {
                        resData.errorMessage.fatalError = "Something went wrong!!";
                        return res.json(resData);
                    }
                    /*sendOTP(res,resData,otp,() => {*/
                        console.log(otp);
                        resData.tempAccessToken = accessTokenManager.generateAccessToken({tempUserId: tempUserId,tempSessionId: req.session.id});
                        resData.success = true;
                        return res.json(resData);
                    //});

                });
            });
        }
    });
}

const verifyOtp = (req,res,resData,cb) => {

    var decoded = accessTokenManager.verifyAccessToken(req.body.tempAccessToken);
    if(!decoded || !validator.isPositiveNumber(decoded.tempUserId) || !decoded.tempSessionId || !req.body.contactNo) {
        resData.errorMessage.fatalError = 'Invalid request';
        return res.json(resData);
    }

    let tempUserId = decoded.tempUserId;
    let tempSessionId = decoded.tempSessionId;
    let query = "contactNo="+ req.body.contactNo + " AND id="+ tempUserId +" AND tempSessionId='"+ tempSessionId +"';";

    tempUserModel.getDetails(res,resData,query,"otp,otpTrials",(tempUser) => {
        if(!tempUser) {
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        if(tempUser.otpTrials >= 5) {
            resData.errorMessage.fatalError = "You have entered wrong verification code too many times. Please wait for 10 minutes and try again by clicking on 'Resend verification code' button below";
            return res.json(resData);
        }

        if(tempUser.otp != req.body.otp) {
            tempUserModel.update(res,resData,"id="+ tempUserId,{otpTrials: tempUser.otpTrials + 1},() => {
                resData.errorMessage.otp = "Verification code did not match";
                return res.json(resData);
            })
        }
        else {
            cb(tempUserId);
        }
    });
}

router.post('/register/init',function(req,res) {
    createTempUser(req,res,false);
});

router.post('/register/set-password',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        },
        accessToken: ""
    }
    
    verifyOtp(req,res,resData,(tempUserId) => {
        validateAndPreparePassword(req,res,resData,(hashedPassword) => {
            userModel.create(res,resData,{contactNo: req.body.contactNo, password: hashedPassword},(userId) => {
                if(!userId) {
                    resData.errorMessage.fatalError = "Something went wrong!!";
                    return res.json(resData);
                }
                tempUserModel.delete(res,resData,"id="+ tempUserId,() => {
                    resData.timeOut = new Date(Date.now() + 24*3600*1000);
                    resData.accessToken = accessTokenManager.generateAccessToken({userId: userId, sessionId: req.session.id});
                    resData.success = true;
                    return res.json(resData);
                });
            });
        })
    });
});

router.post('/send-otp-again',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        }
    }

    var decoded = accessTokenManager.verifyAccessToken(req.body.tempAccessToken);
    if(!decoded || !validator.isPositiveNumber(decoded.tempUserId) || !decoded.tempSessionId) {
        resData.errorMessage.fatalError = 'Invalid request';
        return res.json(resData);
    }

    let tempUserId = decoded.tempUserId;
    let tempSessionId = decoded.tempSessionId;
    let query = "contactNo="+ req.body.contactNo + " AND id="+ tempUserId +" AND tempSessionId='"+ tempSessionId +"';";

    tempUserModel.getDetails(res,resData,query,"otp,otpTrials,lastOtpSendTime",(tempUser) => {
        if(!tempUser) {
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        let timeIntervalLastOtp = Math.abs(new Date() - tempUser.lastOtpSendTime);

        if(tempUser.otpTrials >= 5) {
            if(timeIntervalLastOtp >= 600000) {
                let otp =  Math.floor(100000 + Math.random() * 900000);
                /*sendOTP(res,resData,otp,() => {*/
                    tempUserModel.update(res,resData,"id="+ tempUserId,{otp: otp,otpTrials: 0,lastOtpSendTime: new Date()},() => {
                        resData.success = true;
                        return res.json(resData);
                    });
                //});
            }
            else {
                let interval = 600000 - timeIntervalLastOtp;
                if(interval >= 60000) {
                    var minuteInterval = Math.floor(interval / 60000);
                    resData.errorMessage.fatalError = 'You entered wrong verification code too many times. Please wait for ' + minuteInterval + ' more minute(s) and try again';
                }
                else {
                    var secondInterval = Math.floor(interval / 1000) + 1;
                    resData.errorMessage.fatalError = 'You entered wrong verification code too many times. Please wait for ' + secondInterval + ' more second(s) and try again';
                }
 
                return res.json(resData);
            }

        }
        else {
            if(timeIntervalLastOtp >= 30000) {
                /*sendOTP(res,resData,tempUser.otp,() => {*/
                    tempUserModel.update(res,resData,"id="+ tempUserId,{lastOtpSendTime: new Date()},() => {
                        resData.success = true;
                        return res.json(resData);
                    });
                //});
            }
            else {
                let interval = Math.floor((30000 - timeIntervalLastOtp) / 1000);
                resData.errorMessage.fatalError = 'A verification code was sent to your phone number a few seconds ago. Please wait for that one to arrive or, try again after ' + interval + ' second(s)';
                return res.json(resData);
            }
        }
    });
});

router.post('/log-in',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        },
        accessToken: ""
    };

    if(!validator.isValidPhoneNumber(req.body.contactNo)) {
        resData.errorMessage.contactNo = "Enter a valid phone number";
        return res.json(resData);
    }

    userModel.getDetails(res,resData,"contactNo="+ req.body.contactNo,"id,password",(user) => {
        if(!user) {
            resData.errorMessage.contactNo = "No user exists with this phone number";
            return res.json(resData);
        }

        matchPassword(res,resData,req.body.password,user.password,() => {
            resData.timeOut = new Date(Date.now() + 24*3600*1000);
            resData.accessToken = accessTokenManager.generateAccessToken({userId: user.id, sessionId: req.session.id});
            resData.success = true;
            res.json(resData);
        });
    });
});

router.post('/log-out',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: "",
            authError:  false
        }
    }

    const isLoggedIn = require('../helpers/isLoggedIn');
    isLoggedIn(req,res,resData,null,(user) => {
        req.session.destroy();
        resData.success = true;
        res.json(resData);
    })
});

router.post('/recover-password/init',function(req,res) {
    createTempUser(req,res,true);
});

router.post('/recover-password/change-password',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        },
        accessToken: ""
    }

    verifyOtp(req,res,resData,(tempUserId) => {
        validateAndPreparePassword(req,res,resData,(hashedPassword) => {
            userModel.update(res,resData,"contactNo="+ req.body.contactNo,{password: hashedPassword},(userId) => {
                if(!userId) {
                    resData.errorMessage.fatalError = "Something went wrong!!";
                    return res.json(resData);
                }

                tempUserModel.delete(res,resData,"id="+ tempUserId,() => {
                    resData.timeOut = new Date(Date.now() + 24*3600*1000);
                    resData.accessToken = accessTokenManager.generateAccessToken({userId: userId, sessionId: req.session.id});
                    resData.success = true;
                    return res.json(resData);
                });
            });
        })
    });
});

router.post('/update/change-password',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        }
    }

    const isLoggedIn = require('../helpers/isLoggedIn');
    isLoggedIn(req,res,resData,"id,password",(user) => {
        matchPassword(res,resData,req.body.currentPassword,user.password,() => {
            validateAndPreparePassword(req,res,resData,(hashedPassword) => {
                userModel.update(res,resData,"id="+ user.id,{password: hashedPassword},(userId) => {
                    resData.success = true;
                    return res.json(resData);
                });
            })
        });
    });
});


router.post('/update/profile',function(req,res) {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        },
        accessToken: ""
    };

    const isLoggedIn = require('../helpers/isLoggedIn');
    isLoggedIn(req,res,resData,"id",(user) => {
        let updatedUser = validateUserProfileData(req.body,resData.errorMessage);

        if(!updatedUser)
            return res.json(resData);

        userModel.update(res,resData,"id="+ user.id,updatedUser,(userId) => {
            resData.success = true;
            return res.json(resData);
        });
    });
});

module.exports = router;