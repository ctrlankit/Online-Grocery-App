import { body, param } from "express-validator";
import Customer from "../models/customer.model.js";
import Location from "../models/location.model.js";

const LocationValidation = {
  createLocation: [
    body("zone").notEmpty().withMessage("Zone is required"),
    body("area").notEmpty().withMessage("Area is required"),
    body("longitude")
      .optional()
      .isString()
      .withMessage("Longitude is not valid"),
    body("latitude").optional().isString().withMessage("Latitude is not valid"),
  ],
  updateLocation: [
    param("id")
      .isMongoId()
      .withMessage("Id is not valid")
      .custom(async (id) => {
        const location = await Location.findOne({ _id: id });
        if (!location) {
          throw new Error("Location not found");
        }
      }),
    body("zone").optional().isString().withMessage("Zone is required"),
    body("area").optional().isString().withMessage("Area is required"),
    body("longitude")
      .optional()
      .isString()
      .withMessage("Longitude is not valid"),
    body("latitude").optional().isString().withMessage("Latitude is not valid"),
  ],
  deleteLocation: [
    param("id")
      .isMongoId()
      .withMessage("Id is not valid")
      .custom(async (id) => {
        const location = await Location.findOne({ _id: id });
        if (!location) {
          throw new Error("Location not found");
        }
      }),
  ],
  userLocationList: [
    param("result_per_page").optional().isInt().withMessage("result_per_page is not valid"),
    param("paginate").optional().isBoolean().withMessage("pagiante must be true or false"),
    param("search_key").optional().isString().withMessage("search key is not valid"),
    
  ],
};

export default LocationValidation;
