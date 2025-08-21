// @@ external modules
const {body} = require("express-validator");
const {phone} = require("phone");
const geoInfo = require("../utils/geoInfo");
const CompanyModel = require("../model/CompanyModel");
const AuthModel = require("../model/AuthModel");
const mongoose = require("mongoose")

const AuthRegisterValidation = [
    body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .bail()
    .isLength({min:3})
    .withMessage("Name must be at lest 3 characters"),


    body("company")
    .trim()
    .notEmpty().withMessage("Company is required")
    .bail()
    .custom(async (companyId)=>{

        if(!mongoose.Types.ObjectId.isValid(companyId)){
            throw new Error("Invalid company");
        }

        const checkCompanyExist = await CompanyModel.exists({_id: companyId});
        if(!checkCompanyExist){
            throw new Error("This company does not exist");
        }

        return true;
    }),


    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email")
    .bail()
    .custom(async (email)=>{
        const checkEmailExist = await CompanyModel.exists({email}) || await AuthModel.exists({email});
        if(checkEmailExist){
            throw new Error("This email already exist");
        }
        return true;
    }),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .bail()
    .custom(async (value,{req})=>{
        const countryCode =  geoInfo(req).country;
        const validator = phone(value,{country: countryCode});
        if(!validator.isValid){
            throw new Error("Invalid phone number");
        }
        const phoneNumber = validator.phoneNumber;

        const checkExistPhoneNumber = await CompanyModel.exists({phone:phoneNumber}) || await AuthModel.exists({phone: phoneNumber});

        if(checkExistPhoneNumber){
            throw new Error("This number already exists");
        }

        return true;
    }),


    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")    
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),


    body("role")
    .notEmpty().withMessage("Role is required")
    .bail()
    .isIn(["admin", "manager", "employee"]) 
    .withMessage("Role must be Admin, Manager or Employee") ,


    body("status")
    .notEmpty().withMessage("Status is required")
    .bail()
    .isIn(["online", "offline", "busy", "away"])
    .withMessage("Status must be online, offline, busy, or away"),

];



module.exports = AuthRegisterValidation;