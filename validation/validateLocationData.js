const validator = require("../helpers/validationHelper");
module.exports = (data,errorMessage) => {
    let newLocation = {};
    let error = false;

    if(!data.name) {
        newLocation.name = null;
    } else {
        newLocation.name = data.name;
    }

    if(!data.city) {
        newLocation.city = null;
    } else {
        newLocation.city = data.city;
    }

    if(!data.thana) {
        newLocation.thana = null;
    } else {
        newLocation.thana = data.thana;
    }

    if(!data.area) {
        newLocation.area = null;
    } else {
        newLocation.area = data.area;
    }

    if(!data.road) {
        newLocation.road = null;
    } else {
        newLocation.road = data.road;
    }

    if(!data.house) {
        newLocation.house = null;
    } else {
        newLocation.house = data.house;
    }

    if(!data.fullAddress) {
        newLocation.fullAddress = null;
    } else {
        newLocation.fullAddress = data.fullAddress;
    }

    if(!data.latitude) {
        newLocation.latitude = null;
    } else {
        newLocation.latitude = data.latitude;
    }

    if(!data.longitude) {
        newLocation.longitude = null;
    } else {
        newLocation.longitude = data.longitude;
    }

    if(!data.contactNo) {
        newLocation.contactNo = null;
    } else {
        newLocation.contactNo = data.contactNo;
    }

    if(!data.contactNo2) {
        newLocation.contactNo2 = null;
    } else {
        newLocation.contactNo2 = data.contactNo2;
    }

    if(!error)
        return newLocation;
}