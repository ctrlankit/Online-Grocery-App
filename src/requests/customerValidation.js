// customerValidation.js
import { body } from "express-validator";

const customerValidation = {
  sendOtp: [
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone("any").withMessage("Phone number is not valid"),
  ],
  verifyOtp: [
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone("any").withMessage("Phone number is not valid"),
    body("otp")
      .notEmpty().withMessage("OTP is required"),
  ],
  register: [
    body("user_name")
      .notEmpty().withMessage("Name is required"),
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone("any").withMessage("Phone number is not valid"),
    body("password")
      .notEmpty().withMessage("Password is required"),
  ],
};

export default customerValidation;
