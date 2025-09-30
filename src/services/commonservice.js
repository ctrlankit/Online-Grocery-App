import Customer from "../models/customer.model.js";
import { logError } from "../utils/logger.js";

const commonservice = 
{
  
  // recursive generate otp function
  generateOtp: async function () {
    let otp = Math.floor(100000 + Math.random() * 900000);

    try {
      const existingCustomer = await Customer.findOne({ otp: otp });
      if (existingCustomer) {
        return await this.generateOtp();
      } else {
        return otp;
      }
    } catch (error) {
      logError("Error generating OTP:", error);
      return null;
    }
  },

  //pagination function
  paginate: async (model, query, page = 1, per_page = 10, populate = null) => {
    const limit = parseInt(per_page) || 10;
    const current_page = parseInt(page) || 1;

    const total = await model.countDocuments(query.getFilter());

    let dbQuery = query.skip((current_page - 1) * limit).limit(limit);

    if (populate) {
      dbQuery = dbQuery.populate(populate);
    }

    const result = await dbQuery.exec();

    return {
      data: result,
      meta: {
        total,
        per_page: limit,
        current_page: current_page,
        last_page: Math.ceil(total / limit),
      },
    };
  }
};

export default commonservice;
