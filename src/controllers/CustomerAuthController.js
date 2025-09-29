import Customer from "../models/customer.model.js";
import AuthToken from "../models/auth.token.js";
import { generateToken } from "../utils/generateToken.js";
import { logError } from "../utils/logger.js";
import { fileURLToPath } from "url";
import controller from "./controller.js";
import commonservice from "../services/commonservice.js";
import Location from "../models/location.model.js";

const __filename = fileURLToPath(import.meta.url);
class CustomerAuthController extends controller {
  sendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
      const customer = await Customer.findOne({ phone });
      const otp = await commonservice.generateOtp();
      if (!customer) {
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
        return this.successFullyCreatedResponse(
          res,
          "OTP verified successfully"
        );
      } else {
        return this.errorResponse(res, "Invalid OTP");
      }
    } catch (error) {
      logError(__filename, "verifyOtp", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  customerRegister = async (req, res) => {
    const {
      phone,
      otp,
      user_name,
      zone,
      area,
      latitude,
      longitude,
      email,
      password,
    } = req.body;
    try {
      const customer = await Customer.where("phone")
        .equals(phone)
        .where("otp")
        .equals(otp)
        .findOne();

      if (customer) {
        customer.user_name = user_name;
        customer.email = email;
        customer.password = password;
        customer.zone = zone;
        customer.area = area;
        customer.save();

        await Location.create({
          customer_id: customer._id,
          zone: zone,
          area: area,
          longitude: longitude ?? "",
          latitude: latitude ?? "",
        });
        return this.successFullyCreatedResponse(
          res,
          "Customer registered successfully"
        );
      } else {
        return this.errorResponse(res, "Invalid customer");
      }
    } catch (error) {
      logError(__filename, "customerRegister", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  customerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await Customer.where("email").equals(email).findOne();
      if (customer) {
        const isMatch = await customer.comparePassword(password);
        if (isMatch) {
          const token = await generateToken(customer._id);

          // save token
          await AuthToken.create({
            token: token,
            clientId: customer._id,
            revoked: false,
          });
          customer._doc.token = token;
          return this.successResponse(res, customer);
        } else {
          return this.errorResponse(res, "Invalid credentials");
        }
      } else {
        return this.errorResponse(res, "Invalid credentials");
      }
    } catch (error) {
      logError(__filename, "customerLogin", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  getProfile = async (req, res) => {
    try {
      const customer = await Customer.findOne({ _id: req.user.id });
      return this.successResponse(res, customer);
    } catch (error) {
      logError(__filename, "getProfile", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  logout = async (req, res) => {
    try {
      const customer = await Customer.findOne({ _id: req.user.id });
      if (customer) {
        const tokens = await AuthToken.updateMany(
          { clientId: customer._id, revoked: false },
          { $set: { revoked: true } }
        );
      }
      return this.successFullyCreatedResponse(res, "Logout successfully");
    } catch (error) {
      logError(__filename, "logout", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  updateProfile = async (req, res) => {
    const { email, user_name, phone } = req.body;
    try {
      let data = {};
      if (user_name) data.user_name = user_name;
      if (email) data.email = email;
      if (phone) data.phone = phone;

      const customer = await Customer.findByIdAndUpdate(req.user.id, data, {
        new: true,
      });
      if (customer)
        return this.successFullyCreatedResponse(
          res,
          "Profile updated successfully"
        );
    } catch (error) {
      logError(__filename, "updateProfile", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };
}
export default new CustomerAuthController();
