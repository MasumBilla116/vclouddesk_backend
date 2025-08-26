const AuthModel = require("../model/AuthModel");
const CompanyModel = require("../model/CompanyModel");
const generateJWT = require("../utils/generateJwtToken");
const { errorResponse, successResponse } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const geoInfo = require("../utils/geoInfo");
const { phone: phoneNumberValidator } = require("phone");
const MailTemplate = require("../utils/MailTemplate");
const sendMail = require("../service/sendMail");
const VerificationModel = require("../model/VerificationModel");
const formValidationError = require("../utils/formValidationError");
const generateValidPhoneNumber = require("../utils/generateValidPhoneNumber");

class AuthController {
  constructor() {}


  async getCompanyWiseUser(req,res,next){

  }

  async register(req, res, next) {
    const session = await AuthModel.startSession();
    session.startTransaction();

    try {
      const validate = validationResult(req);
      if (!validate.isEmpty()) {
        return errorResponse(res, "Validation failed", 409, validate.array());
      }

      const { name, company, email, phone, password, role, status } = req.body;

      // @@ validate phone number
      const geoCountry = geoInfo(req).country;
      let validatePhone = phoneNumberValidator(phone, { country: geoCountry });
      const validPhoneNumber = validatePhone.phoneNumber;

      const hasRound = Number(process.env.ENCRYPT_HAS_ROUND) || 12;
      const hasPassword = await bcrypt.hash(password, hasRound);

      // @@ register new user
      const newUser = new AuthModel({
        name,
        company,
        email,
        phone: validPhoneNumber,
        password: hasPassword,
        role,
        status,
      });

      await newUser.save({ session });

      // @@ send mail
      const template = MailTemplate.welcome(name);
      await sendMail(email, "Welcome to pewdesk", template);

      await session.commitTransaction();
      session.endSession();

      return successResponse(res, "Registration successfull");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error.name === "ValidationError") {
        return errorResponse(res, error);
      }

      return errorResponse(res, "Something went wrong", 500, error.message);
    }
  }

  async login(req, res, next) {
    const { email_or_phone, password } = req.body;

    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      return errorResponse(res, "Validation failed", 409, validate.array());
    }

    // @@ validate phone number 017
    const geoCountry = geoInfo(req).country;
    const validatePhone = phoneNumberValidator(email_or_phone, {
      country: geoCountry,
    });
    const phoneNumber = validatePhone.phoneNumber;

    // @@ find user by email OR phone
    const userResponse = await AuthModel.findOne({
      $or: [{ email: email_or_phone }, { phone: phoneNumber }],
    });

    if (!userResponse) {
      return errorResponse(res, "Email or Phone number is not exist", 404);
    }

    const comparePassword = await bcrypt.compare(
      password,
      userResponse.password
    );

    if (!comparePassword) {
      return errorResponse(res, "Password is not match.");
    }

    // @@ generate token
    const tokenPayload = {
      email: userResponse.email,
      phone: userResponse.phone,
      company_id: userResponse.company,
      user_id: userResponse._id,
    };
    const token = await generateJWT(tokenPayload);

    // @@ set response data
    const user = {
      name: userResponse.name,
      email: userResponse.email,
      phone: userResponse.phone,
      role: userResponse.role,
      status: "online",
      company_id: userResponse.company,
      user_id: userResponse._id,
      permission: {},
      avater: "",
    };

    const responseData = {
      token,
      user,
    };

    return successResponse(
      res,
      "Company and admin user registered successfully",
      responseData
    );
  }

  async forgotpassword(req, res, next) {
    const { email_or_phone } = req.body;
    const session = await VerificationModel.startSession();
    session.startTransaction();

    try {
      // @@ validate request
      const validate = validationResult(req);
      if (!validate.isEmpty()) {
        return errorResponse(res, "Validation failed", 409, validate.array());
      }

      // @@ detect country (for phone validation)
      const geoCountry = await geoInfo(req);
      let phoneNumber = "";
      const validatePhone = phoneNumberValidator(email_or_phone, {
        country: geoCountry.country || "BD",
      });

      if (validatePhone.isValid) {
        phoneNumber = validatePhone.phoneNumber;
      }

      // @@ find user by email OR phone
      const findUser = await AuthModel.findOne({
        $or: [{ email: email_or_phone }, { phone: phoneNumber }],
      }).session(session);

      if (!findUser) {
        return errorResponse(res, "User credentials do not match", 409);
      }

      // @@ generate 6-digit OTP
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

      // @@ set expiration (15 min)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // @@ save verification
      const verification = new VerificationModel({
        type: "otp",
        code: randomCode,
        target: findUser.email, // or phone if you add SMS later
        expiresAt,
      });

      await verification.save({ session });

      // @@ send mail
      const mailTemplate = MailTemplate.passwordReset(
        findUser.name,
        randomCode
      );
      await sendMail(findUser.email, "Reset your password", mailTemplate);

      // @@ commit transaction
      await session.commitTransaction();
      session.endSession();

      return successResponse(res, "Please check your email for the reset code");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (error.name === "ValidationError") {
        return formValidationError(res, error);
      }

      return errorResponse(res, "Something went wrong", 500, error.message);
    }
  }

  async resetpassword(req, res, next) {
    const session = await AuthModel.startSession();
    session.startTransaction();

    try {
      const { email_or_phone, password } = req.body;

      const validate = validationResult(req);
      if (!validate.isEmpty()) {
        return errorResponse(res, "Validation failed", 409, validate.array());
      }

      const validatedPhone = generateValidPhoneNumber(req, email_or_phone);

      const hasRound = Number(process.env.ENCRYPT_HAS_ROUND) || 12;
      const hasPassword = await bcrypt.hash(password, hasRound);

      const response = await AuthModel.updateOne(
        { $or: [{ email: email_or_phone }, { phone: validatedPhone.number }] },
        { $set: { password: hasPassword } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      if (response.modifiedCount === 0) {
        return errorResponse(res, "User not found from this email/phone", 404);
      }
      return successResponse(res, "Password reset success");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error.name === "ValidationError") {
        return formValidationError(res, error);
      }

      return errorResponse(
        res,
        "Something went wrong, please try again",
        500,
        error
      );
    }
  }

  // @@ controller method
  async verifyOTP(req, res, next) {
    try {
      const { email_or_phone, code } = req.body;
 
       // @@ validate request
      const validate = validationResult(req);
      if (!validate.isEmpty()) {
        return errorResponse(res, "Validation failed", 409, validate.array());
      }

      // @@ Normalize phone (if it's a number)
      const validatedPhone = generateValidPhoneNumber(req, email_or_phone);

      const verificationResponse = await VerificationModel.findOne({
         verified: false,
        $or: [{ target: email_or_phone }, { target: validatedPhone.number }],
      });

      if (!verificationResponse) {
        return errorResponse(res, "Session is expire or user not found",409);
      }

      if (verificationResponse.code.toString() !== code.toString()) {
        return errorResponse(res, "OTP is not matched",409);
      }

      const nowDate = new Date();
      if (verificationResponse.expiresAt < nowDate) {
        return errorResponse(res, "OTP is expired",409);
      }

      verificationResponse.verified = true;
      await verificationResponse.save();

      return successResponse(res, "OTP verified successfully");
    } catch (error) {
      return errorResponse(
        res,
        "Something went wrong, please try again",
        500,
        error.message
      );
    }
  }
}

module.exports = AuthController;
