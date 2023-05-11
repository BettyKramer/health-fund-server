

//check if contains only numbers
containsOnlyNumbers = (str) => {
    return /^\d+$/.test(str);
}


//checks if string is valid
checkString = (param, string, maxlength, minlength, missisngs) => {
    if (param == null) {
        missisngs.push(`misisng parameter ${string}`);
        return false;
    }
    else {
        if (param.length > maxlength || param.length < minlength) {
            missisngs.push(`illigal ${string}`);
            return false;
        }
    }

    return true;
}



//checks if a date is valid
checkDate = (date, string, missings) => {
    if (date == null) {
        missings.push(`misisng parameter ${string}`);
        return false;
    }
    else {
        if (Date.parse(date) == NaN) {
            missings.push(`illigal ${string}`);
            return false;
        }
    }

    return true;
}


//checks numbers
checkNumbers = (number, string, maxlength, minlength, missings) => {
    if (number == null) {
        missings.push(string);
        return false;
    }
    //check that it has the exactly amount of digits
    if (number.length > maxlength || number.length < minlength) {
        missings.push(`illigal ${string}`);
        return false;
    }
    return true;
}


//checks  phone numbers
checkPhoneNumbers = (phoneNumber, string, maxlength, minlength, missings) => {
    if (phoneNumber == null) {
        missings.push(string);
    }
    else {
        //check that it has the exactly amount of digits
        if (!containsOnlyNumbers(phoneNumber) || phoneNumber.length > maxlength || phoneNumber.length < minlength)
            missings.push(`illigal ${string}`);
    }
}
module.exports = { containsOnlyNumbers, checkDate, checkNumbers, checkString, checkPhoneNumbers };



