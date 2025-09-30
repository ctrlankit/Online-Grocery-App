import express from 'express';
const router = express.Router();
import customerRoute from './customer.route.js';
import locationRoute from './location.route.js';


router.use('/customer', customerRoute);
router.use('/location', locationRoute);


export default router;