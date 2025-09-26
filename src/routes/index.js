import express from 'express';
const router = express.Router();
import customerRoute from './customer.route.js';


router.use('/customer', customerRoute);


export default router;