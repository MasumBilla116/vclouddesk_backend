// @@ internal modules
const { successResponse, errorResponse } = require("../utils/response");
const CompanyModel = require("../model/CompanyModel");
const formValidationError = require("../utils/formValidationError");
const geoInfo = require("../utils/geoInfo");
const { phone } = require("phone");
const AuthModel = require("../model/AuthModel");
const bcrypt = require("bcrypt");
const sendMail = require("../service/sendMail");
const MailTemplate = require("../utils/MailTemplate");
const generateJWT = require("../utils/generateJwtToken");
const {validationResult} = require("express-validator");

class CompanyController {
  constructor() {}

  /**
   * @desc Register a new company
   * @api version use (v1)
   */

  async register(req, res, next) {
    const session = await CompanyModel.startSession();
    session.startTransaction();

    try {
      const {
        ownername,
        companyname,
        email,
        password,
        phone: phoneInput,
      } = req.body;

      const validate = validationResult(req);
      if(!validate.isEmpty()){
          return errorResponse(res,"Validation failed",409,validate.array())
      }
       

      const geoCountry = geoInfo(req).country || "BD";
      let validatedPhone = phone(phoneInput, { country: geoCountry });

      if (!validatedPhone.isValid) {
        return errorResponse(res, "Invalid phone number", 409);
      }

      validatedPhone = validatedPhone.phoneNumber; 

      const newCompany = new CompanyModel({
        name: companyname,
        email,
        phone: validatedPhone,
      });

      const savedCompany = await newCompany.save({ session });

      const hasPassword = await bcrypt.hash(password, 12);
      const newUser = new AuthModel({
        name: ownername,
        email,
        phone: validatedPhone,
        company: savedCompany._id,
        password: hasPassword,
        role: "owner",
        status: "online",
      });

      await newUser.save({ session });

      // @@ send mail
      const template = MailTemplate.welcome(ownername);
      await sendMail(email, "Welcome to pewdesk", template);

      // @@ generate token
      const tokenPayload = {
        email,
        phone: validatedPhone,
        company_id: savedCompany._id,
        user_id: newUser._id,
      };
      const token = await generateJWT(tokenPayload);

      // @@ confirm to commit
      await session.commitTransaction();
      session.endSession();


      // @@ set response data
      const user = {
        name: ownername,
        email,
        phone: validatedPhone,
        role: "admin",
        status: "online",
        company_id: savedCompany._id,
        user_id: newUser._id,
        permission: {},
        avater: "",
      };      

      const responseData = {
        token,
        user,
      };

      return successResponse(
        res,
        "Company registration successfully",
        responseData
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (error.name === "ValidationError") {
        return formValidationError(res, error);
      }
      return errorResponse(res, "Something went wrong", 500, error.message);
    }
  }
}

module.exports = CompanyController;
