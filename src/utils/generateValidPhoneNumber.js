const {phone:phoneNumberValidator} = require("phone");
const geoInfo = require("./geoInfo");

function generateValidPhoneNumber(req,number){
    const geoCountry = geoInfo(req);
    const validate = phoneNumberValidator(number,{country: geoCountry}); 

    return {
        isValid: validate.isValid,
        number: validate.phoneNumber
    }
}



module.exports = generateValidPhoneNumber;