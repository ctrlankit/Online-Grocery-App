import Customer from "../models/customer.model.js";
import AuthToken from "../models/auth.token.js";
import { generateToken } from "../utils/generateToken.js";
import { logError } from "../utils/logger.js";
import { fileURLToPath } from 'url';
import path from 'path';
import { sendMail } from "../services/mailService.js";
import controller from "./controller.js";
import commonservice from "../services/commonservice.js";


const __filename = fileURLToPath(import.meta.url);
class CustomerAuthController extends controller 
{
    
  sendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
      const customer = await Customer.findOne({ phone });
      if (!customer) {
          const otp = await commonservice.generateOtp();
        await Customer.create({
          phone: phone,
          otp: otp,
        });
        return this.successFullyCreatedResponse(res, "OTP sent successfully");
      } else {
        customer.otp = otp;
        customer.save();
        return this.successFullyCreatedResponse(res, "OTP sent successfully");
      }
    } catch (error) {
      logError(__filename, "sendOtp", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    try {
      const customer = await Customer.where("phone")
        .equals(phone)
        .where("otp")
        .equals(otp)
        .findOne();
      if (customer) {
        customer.otp = null;
        await customer.save();
        return this.successFullyCreatedResponse(
          res,
          "OTP verified successfully"
        );
      } else {
        return this.errorResponse(res, "Invalid customer");
      }
    } catch (error) {
      console.log(error);
      logError(__filename, "sendOtp", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };
}
export default new CustomerAuthController();
