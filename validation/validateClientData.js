const validator = require("../helpers/validationHelper");
const validateLocationData = require("./validateLocationData");

module.exports = (data,errorMessage) => {
    let newClient = {};
    let error = false;

    if(!validator.isValidString(data.name,2,200)) {
        error = true;
        errorMessage.name = "Name must be between 2 to 200 character";
    }
    else {
        newClient.name = data.name;
    }

    if(data.website) {
        newClient.website = data.website;
    }

    if(data.locations) {
        if(typeof data.locations === 'object') {
            for(var i = 0; i<data.locations.length; i++) {
                data.locations[i] = validateLocationData(data.locations[i],errorMessage);
                if(!data.locations[i]) {
                    error = true;
                    errorMessage.fatalError = "Something went wrong!!";
                    break;
                } else {
                    data.locations[i] = Object.values(data.locations[i]);
                }

            }
        }
        else {
            error = true;
            errorMessage.fatalError = "Something went wrong!!";
        }
    }

    if(!error)
        return newClient;
}