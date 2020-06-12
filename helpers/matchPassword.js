const validator = require('../helpers/validationHelper');

const matchPassword = (res,resData,password,hashedPassword,cb) => {
    var msg = validator.isValidPassword(password);

    if(msg !== true) {
        resData.errorMessage.password = "Wrong password!! Try again";
        return res.json(resData);
    }

    bcrypt.compare(password,hashedPassword).then(function(result) {
        if(!result) {
            resData.errorMessage.password = "Wrong password!! Try again";
            return res.json(resData);
        }

        cb();
    })
    .catch(err => {
        console.log("ERROR: "+err);
        resData.errorMessage.fatalError = "Something went wrong!!";
        return res.json(resData);
    });
}

module.exports = matchPassword;