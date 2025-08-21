const {body} = require("express-validator");

const VerifyOTPValidation = [
    body("email_or_phone")
    .trim()
    .notEmpty()
    .withMessage("Email or phone is required"),
    
    body("code").trim()
    .notEmpty()
    .withMessage("Code is required")
    .bail()
    .isLength({min:6})
    .withMessage("Minimum code length is 6 charecters")
    .bail()
    .isLength({max:6})    
    .withMessage("Maximum code length is 6 charecters")
    
];



module.exports = VerifyOTPValidation;