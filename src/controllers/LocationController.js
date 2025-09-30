import { logError } from "../utils/logger.js";
import { fileURLToPath } from "url";
import controller from "./controller.js";
import commonservice from "../services/commonservice.js";
import Location from "../models/location.model.js";

const __filename = fileURLToPath(import.meta.url);

class LocationController extends controller 
{
  
  userLocationList = async (req, res) => {
    const { search_key, paginate,page = 1,result_per_page } = req.body
    try {
      let query = Location.where({ customer_id: req.user.id }).where({ "deletedAt": null });

      if (search_key && search_key !== "") {
        const regex = new RegExp(search_key, "i"); // case-insensitive search

        query = query.or([
          { zone: regex },
          { area: regex },
          { longitude: regex },
          { latitude: regex }
        ]);
      }

      if (paginate && paginate == true) {
        const paginatedResult = await commonservice.paginate(Location,query,page,result_per_page)
        return this.successResponse(res, paginatedResult.data, paginatedResult.meta);
      } else {
        const result = await query.limit(result_per_page).exec();
        return this.successResponse(res, result);
      }
    } catch (error) {
      logError(__filename, "userLocationList", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };
  createLocation = async (req, res) => {
    const { zone, area, longitude, latitude } = req.body;
    try {
      if (
        await Location.where({ customer_id: req.user.id })
          .where("zone")
          .equals(zone)
          .where("area")
          .equals(area)
          .findOne()
      ) {
        return this.errorResponse(res, "Location already exists");
      }
      const location = await Location.create({
        customer_id: req.user.id,
        zone: zone,
        area: area,
        longitude: longitude || null,
        latitude: latitude || null,
      });
      if (location) {
        this.successFullyCreatedResponse(res, "Location created successfully");
      }
    } catch (error) {
      logError(__filename, "createLocation", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
      const location = await Location.where("_id")
        .equals(id)
        .where("customer_id")
        .equals(req.user.id)
        .findOne();
      if (location) {
        location.deletedAt = new Date();
        location.save();
        this.successFullyCreatedResponse(res, "Location deleted successfully");
      }
    } catch (error) {
      logError(__filename, "deleteLocation", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };

  updateLocation = async (req, res) => {
    const { id } = req.params;
    const { zone, area, longitude, latitude } = req.body;
    try {

      // check if location is deleted
      if (await Location.where("_id").equals(id).where("deletedAt").ne(null).findOne()) {
        return this.errorResponse(res, "! Invalid Location");
      }
      // check if location belongs to another user
      if (await Location.where("_id").equals(id).where("customer_id").ne(req.user.id).findOne()) {
        return this.errorResponse(res, "!Location does not belong to user");
      }

      let data = {};
      if (zone) data.zone = zone;
      if (area) data.area = area;
      if (longitude) data.longitude = longitude;
      if (latitude) data.latitude = latitude;

      const location = await Location.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, runValidators: true }
      );
      if (location) {
        this.successFullyCreatedResponse(res, "Location updated successfully");
      }
    } catch (error) {
      logError(__filename, "updateLocation", error);
      this.errorResponse(res, "!Ops,Something went wrong");
    }
  };
}

export default new LocationController();
