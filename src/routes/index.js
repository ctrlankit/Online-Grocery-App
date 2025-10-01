import express from 'express';
const router = express.Router();
import customerRoute from './customer.route.js';
import locationRoute from './location.route.js';
import categoryRoute from './category.route.js';


router.use('/customer', customerRoute);
router.use('/location', locationRoute);
router.use('/category', categoryRoute);


export default router;