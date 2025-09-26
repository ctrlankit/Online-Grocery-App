import express  from 'express';
const router = express.Router();
import CustomerAuthController  from '../controllers/customerAuthController.js';
import customerValidation from '../requests/customerValidation.js';
import validate from '../middelwares/validationMiddelware.js';


router.post('/send-otp', customerValidation.sendOtp,validate,CustomerAuthController.sendOtp);
router.patch('/verifyotp', customerValidation.verifyOtp,validate,CustomerAuthController.verifyOtp);

export default router;