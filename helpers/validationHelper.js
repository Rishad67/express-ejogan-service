
const isPositiveNumber = number => {
    if(!number || number === "0" || !/^\+?\d+(\.\d+)?$/.test(number))
        return false;

    return true;
}

const isNonNegativeNumber = number => {
    if(isNumber(number) && number >= 0)
        return true;
    return false;
}

const isNumber = number => {
    if(number !== 0 && (!number || !/^[+-]?\d+(\.\d+)?$/.test(number)))
        return false;

    return true;
}

const isBoolean = val => {
    if(!val || !/^true|false$/.test(val))
        return false;

    return true;
}

const isValidLattitude = lat => {
    if(!isNumber(lat) || lat > 90 || lat < -90)
        return false;
    
    return true;
}

const isValidLongitude = long => {
    if(!isNumber(long) || long > 180 || long < -180)
        return false;
    
    return true;
}

const isValidString = (str,min,max) => {
    if(typeof str !== 'string')
        return false;
    str = str.trim();
    if(min && str.length < min)
        return false;
    if(max && str.length > max)
        return false;

    return true;
}

const isValidPhoneNumber = phoneNumber => {
    const pattern = /^0[^0]\d{9}$/;
    if(!phoneNumber || !pattern.test(phoneNumber))
        return false;

    return true;
}

const isValidPassword = password => {
    if(!password)
        return 'Please enter a valid password';
    if(password.length < 6)
         return 'password must be at least 6 characters';
    if(password.length > 50)
        return  'password must be between 6 to 50 characters';

    return true;
}

const isValidEmail = email => {
    if(!email)
        return false;
    
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email))
        return false;

    return true;
}

module.exports = {
    isPositiveNumber: isPositiveNumber,
    isNonNegativeNumber: isNonNegativeNumber,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isValidLattitude: isValidLattitude,
    isValidLongitude: isValidLongitude,
    isValidString: isValidString,
    isValidPhoneNumber: isValidPhoneNumber,
    isValidPassword: isValidPassword,
    isValidEmail: isValidEmail
};