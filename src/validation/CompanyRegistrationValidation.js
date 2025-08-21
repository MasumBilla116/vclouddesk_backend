const { body } = require("express-validator");
const { phone: phoneNumberValidator } = require("phone");
const geoInfo = require("../utils/geoInfo");
const CompanyModel = require("../model/CompanyModel");
const AuthModel = require("../model/AuthModel");

const CompanyRegistrationValidation = [

  body("ownername")
    .trim()
    .notEmpty().withMessage("Owner name is required")
    .bail()
    .isLength({ min: 3 }).withMessage("Owner name must be at least 3 characters"),

  body("companyname")
    .trim()
    .notEmpty().withMessage("Company name is required")
    .bail()
    .isLength({ min: 3 }).withMessage("Company name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email address")
    .bail()
    .custom(async (email) => {
      const existEmail = await CompanyModel.exists({ email }) || await AuthModel.exists({ email });
      if (existEmail) throw new Error("This email already exists");
      return true;
    }),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .bail()
    .custom(async (value, { req }) => {
      const geo = await geoInfo(req); // ✅ await here
      const geoCountry = geo.country || "BD";

      const validated = phoneNumberValidator(value, { country: geoCountry });
      if (!validated.isValid) throw new Error("Invalid phone number");

      const phone = validated.phoneNumber;

      const existPhone = await CompanyModel.exists({ phone }) || await AuthModel.exists({ phone });
      if (existPhone) throw new Error("This phone number already exists");

      return true;
    }),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

];

module.exports = CompanyRegistrationValidation;
