const {body} = require("express-validator");

const ForgotPasswordValidation = [
    body("email_or_phone")
    .trim()
    .notEmpty()
    .withMessage("Email or phone is required"),
    
];



module.exports = ForgotPasswordValidation;