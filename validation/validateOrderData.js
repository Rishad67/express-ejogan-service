const validator = require("../helpers/validationHelper");
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

    if(!validator.isValidString(data.deliveryAddress,5,100)) {
        error = true;
        errorMessage.deliveryAddress = "address length must be between 5 to 100 character";
    }
    else {
        newOrder.deliveryAddress = data.deliveryAddress;
    }


    if(!validator.isValidLattitude(data.deliveryAddressLattitude) || !validator.isValidLongitude(data.deliveryAddressLongitude)) {
        error = true;
        errorMessage.DeliveryAddressCoordinate = "The location chosen is invalid, try again!";
    }
    else {
        newOrder.deliveryAddressLattitude = data.deliveryAddressLattitude;
        newOrder.deliveryAddressLongitude = data.deliveryAddressLongitude;
    }

    if(!validator.isValidPhoneNumber(data.deliveryContactNo)) {
        error = true;
        errorMessage.deliveryContactNo = "Enter a valid phone number";
    }
    else {
        newOrder.deliveryContactNo = data.deliveryContactNo;
    }
    
    
    if(!error)
        return newOrder;
}