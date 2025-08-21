const { successResponse } = require("../utils/response");

class HomeController{
    constructor(){

    }

    async index(req,res,next){
        return successResponse(res,"Welcome to home page...");
    }

}






module.exports = HomeController;