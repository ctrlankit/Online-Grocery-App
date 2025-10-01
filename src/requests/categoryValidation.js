import { body, param } from "express-validator";
import Category from "../models/Categories.model.js";

const categoryValidation = {
    categoryList: [
        param("result_per_page").optional().isInt().withMessage("result_per_page is not valid"),
        param("paginate").optional().isBoolean().withMessage("pagiante must be true or false"),
        param("search_key").optional().isString().withMessage("search key is not valid"),
    ],
    createCategory: [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").optional().isString().withMessage("Description is not valid"),
        body("image").optional().isString().matches(/^data:image\/(png|jpe?g);base64,/).withMessage("Image must be a valid base64 string (png, jpg, jpeg)"),
    ],
    updateCategory: [
        param("id")
            .isMongoId()
            .withMessage("Id is not valid")
            .custom(async (id) => {
                const category = await Category.findOne({ _id: id });
                if (!category) {
                    throw new Error("Category not found");
                }
            }),
        body("name").optional().isString().withMessage("Name is required"),
        body("description").optional().isString().withMessage("Description is not valid"),
        body("image").optional().isString().matches(/^data:image\/(png|jpe?g);base64,/).withMessage("Image must be a valid base64 string (png, jpg, jpeg)"),
    ],
    deleteCategory: [
        param("id")
            .isMongoId()
            .withMessage("Id is not valid")
            .custom(async (id) => {
                const category = await Category.findOne({ _id: id, deletedAt: null });
                if (!category) {
                    throw new Error("Category not found");
                }
            }),
    ],
};

export default categoryValidation;