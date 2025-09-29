import { body } from "express-validator";
import Customer from "../models/customer.model.js";

const customerValidation = {
  sendOtp: [
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone("any")
      .withMessage("Phone number is not valid"),
  ],
  verifyOtp: [
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone("any")
      .withMessage("Phone number is not valid"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  register: [
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone("any")
      .withMessage("Phone number is not valid"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("zone").notEmpty().withMessage("Zone is required"),
    body("area").notEmpty().withMessage("Area is required"),
    body("longitude")
      .optional()
      .isString()
      .withMessage("Longitude is not valid"),
    body("latitude").optional().isString().withMessage("Latitude is not valid"),
    body("user_name").notEmpty().withMessage("Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login: [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  updateProfile: [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email is not valid")
      .custom(async (email, { req }) => {
        const customer = await Customer.findOne({ email });
        if (customer && customer._id.toString() !== req.user.id) {
          throw new Error("Email already exists");
        }
      }),
    body("user_name").optional().isString().withMessage("Name is not valid"),
    body("phone")
      .optional()
      .isMobilePhone("any")
      .withMessage("Phone number is not valid")
      .custom(async (phone, { req }) => {
        const customer = await Customer.findOne({ phone });
        if (customer && customer._id.toString() !== req.user.id) {
          throw new Error("Phone number already exists");
        }
      }),
  ],
};

export default customerValidation;
