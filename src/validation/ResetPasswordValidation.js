const {body} = require("express-validator");

const ResetPasswordValidation = [
    body("email_or_phone")
    .trim()
    .notEmpty()
    .withMessage("Email or phone is required"),
    
    body("password").trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({min:6})
    .withMessage("Password must be 6 charecters is required"),
    
];



module.exports = ResetPasswordValidation;