const validator = require("../helpers/validationHelper");
module.exports = (data,errorMessage) => {
    let newUser = {};
    let error = false;

    if(!validator.isValidString(data.name,2,20)) {
        error = true;
        errorMessage.name = "name must be between 2 to 20 characters";
    }
    else {
        newUser.name = data.name;
    }

    if(!validator.isValidEmail(data.email)) {
        error = true;
        errorMessage.email = "Enter a valid email";
    }
    else {
        newUser.email = data.email;
    }

    if(!validator.isValidString(data.nid,5,20)) {
        error = true;
        errorMessage.nid = "A valid nid is required";
    }
    else {
        newUser.nid = data.nid;
    }

    if(!error)
        return newUser;
}