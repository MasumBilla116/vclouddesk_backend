const AuthModel = require("../model/AuthModel");
const { errorResponse, successResponse } = require("../utils/response");

class UserController {
  constructor() {}


  async getCompanyWiseUser(req,res,next){
    const company = req.user.company_id;
    if(!company){
      return errorResponse(res,"Company not found",404);
    } 
    const allUser = await AuthModel.find({company});

    return successResponse(res,"success",allUser);
  }
 
}

module.exports = UserController;
