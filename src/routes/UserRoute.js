// @@ External modules
const express = require("express");


// @@ internal Modules 
const UserController = require("../controller/UserController"); 
const Controller = new UserController();

// @@ route 
const UserRoute = express.Router();


 
UserRoute.get("/get/company/wise/users",Controller.getCompanyWiseUser);
 



module.exports = UserRoute;