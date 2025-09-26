import Customer from "../models/customer.model.js";
import { logError } from "../utils/logger.js";

const commonservice = {
  // recursive generate otp function
  generateOtp: async function () {
    let otp = Math.floor(100000 + Math.random() * 900000);

    try {
      const existingCustomer = await Customer.findOne({ otp: otp });
      if (existingCustomer) {
        return await this.generateOtp();
      } else 
      {
        return otp;
      }
    } catch (error) {
      logError("Error generating OTP:", error);
      return null;
    }
  },
};

export default commonservice;
