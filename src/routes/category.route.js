import express  from 'express';
const router = express.Router();
import CategoryController  from '../controllers/CategoryController.js';
import categoryValidation from '../requests/categoryValidation.js';
import validate from '../middelwares/validationMiddelware.js';
import authMiddelware  from '../middelwares/authMiddelware.js';

router.use(authMiddelware);

router.get('/list', categoryValidation.categoryList,validate,CategoryController.categoryList);
router.post('/create', categoryValidation.createCategory,validate,CategoryController.createCategory);
router.put('/update/:id', categoryValidation.updateCategory,validate,CategoryController.updateCategory);
router.delete('/delete/:id', categoryValidation.deleteCategory,validate,CategoryController.deleteCategory);


export default router;