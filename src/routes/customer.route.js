import express  from 'express';
const router = express.Router();
import CustomerAuthController  from '../controllers/CustomerAuthController.js';
import customerValidation from '../requests/customerValidation.js';
import validate from '../middelwares/validationMiddelware.js';
import authMiddelware  from '../middelwares/authMiddelware.js';


router.post('/send-otp', customerValidation.sendOtp,validate,CustomerAuthController.sendOtp);
router.patch('/verifyotp', customerValidation.verifyOtp,validate,CustomerAuthController.verifyOtp);
router.put('/register', customerValidation.register,validate,CustomerAuthController.customerRegister);
router.post('/login', customerValidation.login,validate,CustomerAuthController.customerLogin);

router.use(authMiddelware);

// protected routes
router.get('/profile', CustomerAuthController.getProfile);
router.post('/logout', CustomerAuthController.logout);
router.put('/update-profile', customerValidation.updateProfile,validate,CustomerAuthController.updateProfile);

export default router;