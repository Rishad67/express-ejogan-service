
const usernameOTP = '';
const passwordOTP = '';
const otpUrl = '';
const request = require('request');

const sendOTP = (res,resData,otp,cb) => {
    let data = {
        username: usernameOTP,
        password: passwordOTP,
        number: tempUser.phoneNumber,
        message: 'Your verification code (otp) is ' + otp + '. Do not share this verification code with anyone.'
    };

    request.post({url:otpUrl, formData: data}, function(err, httpResponse, body) {
        if(err) {
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }

        let responseCode = body.split('|');

        if(responseCode[0] === '1101') {
            cb();
        }
        else {
            resData.errorMessage.fatalError = "Something went wrong!!";
            return res.json(resData);
        }
    });
}