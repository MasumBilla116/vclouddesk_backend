const {body} = require("express-validator");

const AuthLoginValidation = [

    body("email_or_phone")
    .trim()
    .notEmpty()
    .withMessage("Email or Phone is required"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required") 
    .isLength({min:6})
    .withMessage("Password is minium 6 charecters")
];


module.exports = AuthLoginValidation;