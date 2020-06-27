const validator = require("../helpers/validationHelper");
const validateLocationData = require('../validation/validateLocationData');

module.exports = (data,errorMessage) => {
    let newOrder = {};
    let error = false;

    if(!validator.isValidString(data.summary,2,200)) {
        error = true;
        errorMessage.summary = "summary length must be between 2 to 200 character";
    }
    else {
        newOrder.summary = data.summary;
    }

    if(!validator.isValidString(data.description,5,500)) {
        error = true;
        errorMessage.description = "description length must be between 5 to 500 character";
    }
    else {
        newOrder.description = data.description;
    }

    /*if(!data.category) {
        error = true;
        errorMessage.category = "Price must be Positive Number";
    }
    else {
        newOrder.category = data.category;
    }*/

    if(!validator.isPositiveNumber(data.totalPrice)) {
        error = true;
        errorMessage.totalPrice = "Price must be Positive Number";
    }
    else {
        newOrder.totalPrice = data.totalPrice;
    }

    if(!validator.isPositiveNumber(data.parcelWeight)) {
        error = true;
        errorMessage.parcelWeight = "Weight must be Positive Number";
    }
    else {
        newOrder.parcelWeight = data.parcelWeight;
    }

    if(!validator.isPositiveNumber(data.parcelLength) || !validator.isPositiveNumber(data.parcelWidth) || !validator.isPositiveNumber(data.parcelHeight)) {
        error = true;
        errorMessage.dimension = "Length, width and height must be Positive Number";
    }
    else {
        newOrder.parcelLength = data.parcelLength;
        newOrder.parcelWidth = data.parcelWidth;
        newOrder.parcelHeight = data.parcelHeight;
    }

    if(!validator.isPositiveNumber(data.clientId)) {
        error = true;
        errorMessage.fatalError = "Something went wrong!!";
    }
    else {
        newOrder.clientId = data.clientId;
    }

    if(typeof data.deliveryAddress  === 'object') {
        data.deliveryAddress = validateLocationData(data.deliveryAddress);
        if(!data.deliveryAddress) {
            error = true;
            errorMessage.fatalError = "Something went wrong!!";
        }
    }
    else {
        if(!validator.isPositiveNumber(data.deliveryAddress)) {
            error = true;
            errorMessage.fatalError = "Something went wrong!!";
        }
        else {
            newOrder.deliveryAddressId = data.deliveryAddress;
        }
        data.deliveryAddress = undefined;
    }


    if(!validator.isPositiveNumber(data.pickupLocationId)) {
        error = true;
        errorMessage.fatalError = "Something went wrong!!";
    }
    else {
        newOrder.pickupLocationId = data.pickupLocationId;
    }

    if(!error)
        return newOrder;
}