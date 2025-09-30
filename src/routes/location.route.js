import express from "express";
const router = express.Router();
import LocationController from "../controllers/LocationController.js";
import locationValidation from "../requests/locationValidation.js";
import validate from "../middelwares/validationMiddelware.js";
import authMiddelware from "../middelwares/authMiddelware.js";

router.use(authMiddelware);

router.post("/create-location", locationValidation.createLocation, validate, LocationController.createLocation);
router.delete('/delete-location/:id', locationValidation.deleteLocation, validate, LocationController.deleteLocation);
router.get('/list', locationValidation.userLocationList, validate, LocationController.userLocationList);
router.put('/update-location/:id', locationValidation.updateLocation, validate, LocationController.updateLocation);

export default router;
