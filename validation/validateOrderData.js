const validator = require("../helpers/validationHelper");
const validateLocationData = require('../validation/validateLocationData');
const constants = require('../helpers/constants');

module.exports = (data,errorMessage) => {
    let newOrder = {};
    let error = false;

    if(!validator.isValidString(data.description,5,500)) {
        error = true;
        errorMessage.description = "description length must be between 5 to 500 character";
    }
    else {
        newOrder.description = data.description;
    }

    newOrder.cashOndelivery = data.cashOndelivery ? 1 : 0;
    newOrder.breakable = data.breakable ? 1 : 0;
    newOrder.shippingType = data.shippingType;

    if(/^[0-2]$/.test(data.parcelSize)) {
        newOrder.parcelSize = constants.parcelSize[data.parcelSize];
    }
    else {
        error = true;
        errorMessage.fatalError = "Invalid parcel size received";
    }

    if(data.cashOndelivery) {
        if(!validator.isPositiveNumber(data.collectionAmount)) {
            error = true;
            errorMessage.collectionAmount = "Price must be Positive Number";
        }
        else {
            newOrder.collectionAmount = data.collectionAmount;
        }
    }
    else {
        newOrder.collectionAmount = 0;
    }

    if(!validator.isPositiveNumber(data.parcelWeight)) {
        error = true;
        errorMessage.parcelWeight = "Weight must be Positive Number";
    }
    else {
        newOrder.parcelWeight = data.parcelWeight;
    }

    if(data.weightUnit === "KG" || data.weightUnit === "Gram") {
        newOrder.weightUnit = data.weightUnit;
    }
    else {
        error = true;
        errorMessage.fatalError = "Invalid weight unit received";
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