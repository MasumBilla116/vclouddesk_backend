// @@ External modules
const express = require("express");


// @@ internal Modules
const CompanyController = require("../controller/CompanyController");
const CompanyRegistrationValidation = require("../validation/CompanyRegistrationValidation");
const Controller = new CompanyController();

// @@ route 
const CompanyRoute = express.Router();



CompanyRoute.post("/company/register",CompanyRegistrationValidation,Controller.register);




module.exports = CompanyRoute;