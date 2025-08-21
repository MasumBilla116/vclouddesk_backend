// @@ External modules
const express = require("express");


// @@ internal Modules
const AuthRegisterValidation = require("../validation/AuthRegisterValidation");
const AuthLoginValidation = require("../validation/AuthLoginValidation");
const AuthController = require("../controller/AuthController");
const ForgotPasswordValidation = require("../validation/ForgotPasswordValidation");
const ResetPasswordValidation = require("../validation/ResetPasswordValidation"); 
const VerifyOTPValidation = require("../validation/VerifyOTPValidation");
const Controller = new AuthController();

// @@ route 
const AuthRoute = express.Router();



AuthRoute.post("/auth/login",AuthLoginValidation,Controller.login);
AuthRoute.post("/auth/register",AuthRegisterValidation,Controller.register);
AuthRoute.post("/auth/forgotpassword",ForgotPasswordValidation,Controller.forgotpassword);
AuthRoute.post("/auth/resetpassword",ResetPasswordValidation,Controller.resetpassword);
AuthRoute.post("/auth/verify/otp",VerifyOTPValidation,Controller.verifyOTP);




module.exports = AuthRoute;