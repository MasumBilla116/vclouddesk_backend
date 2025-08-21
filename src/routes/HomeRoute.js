// @@ External Modules
const express = require("express");
const Controller = require("../controller/HomeController");



// @@ routes
const HomeRoute = express.Router();

const HomeController = new Controller();
// @@ route
HomeRoute.get("/",HomeController.index);




module.exports = HomeRoute;