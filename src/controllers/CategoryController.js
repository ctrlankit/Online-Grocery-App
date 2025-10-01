import { logError } from "../utils/logger.js";
import { fileURLToPath } from "url";
import controller from "./controller.js";
import commonservice from "../services/commonservice.js";
import { uploadMedia, updateMedia, createMedia } from "../services/imageservice.js";
import Category from "../models/Categories.model.js";
import imagePaths from "../config/image.js";


const __filename = fileURLToPath(import.meta.url);

class CategoryController extends controller {

    categoryList = async (req, res) => {
        const { search_key, paginate, page = 1, result_per_page } = req.body

        try {
            let query = Category.where({}).where({ "deletedAt": null });
            if (search_key && search_key !== "") {
                const regex = new RegExp(search_key, "i"); // case-insensitive search
                query = query.or([
                    { name: regex },
                    { description: regex },
                ]);
            }
            if (paginate && paginate == true) {
                console.log("result_per_page", result_per_page);
                const paginatedResult = await commonservice.paginate(Category, query, page, result_per_page)
                return this.successResponse(res, paginatedResult.data, paginatedResult.meta);
            } else {
                const result = await query.limit(result_per_page).exec();
                return this.successResponse(res, result);
            }
        } catch (error) {
            logError(__filename, "CategoryList", error);
            this.errorResponse(res, "!Ops,Something went wrong");
        }
    }

    createCategory = async (req, res) => {
        const { name, description, image } = req.body
        try {
            if (await Category.where({ name: name }).where({ deletedAt: null }).findOne()) {
                return this.errorResponse(res, "Category already exist");
            }
            const category = await Category.create({ name, description, image });

            if (image) {
                const uploadImage = await uploadMedia(image, imagePaths.CategoryImage);
                if (uploadImage) {
                    await createMedia(uploadImage, category);
                }
            }
            return this.successResponse(res, "Category created successfully");
        } catch (error) {
            logError(__filename, "createCategory", error);
            this.errorResponse(res, "!Ops,Something went wrong");
        }
    }

    updateCategory = async (req, res) => {
        const { id } = req.params;
        const { name, description, image } = req.body;

        try {
            const existingCategory = await Category.findOne({ _id: id });
            if (!existingCategory) {
                return this.errorResponse(res, "Category not found");
            } else if (await Category.findOne({ _id: { $ne: id }, name: name, deletedAt: null })) {
                return this.errorResponse(res, "Category already exist");
            }

            let data = {};
            if (name) data.name = name;
            if (description) data.description = description;
            const category = await Category.findOneAndUpdate(
                { _id: id },
                { $set: data },
                { new: true }
            );

            if (image) {
                const uploadImage = await uploadMedia(image, imagePaths.CategoryImage);
                if (uploadImage) {
                    await updateMedia(uploadImage, category);
                }
            }

            return this.successResponse(res, "Category updated successfully");
        } catch (error) {
            logError(__filename, "updateCategory", error);
            this.errorResponse(res, "!Ops, Something went wrong");
        }
    };

    deleteCategory = async (req, res) => {
        const { id } = req.params
        try {
            const category = await Category.findOne({ _id: id, deletedAt: null });
            category.deletedAt = new Date();
            await category.save();
            return this.successResponse(res, "Category deleted successfully");
        } catch (error) {
            logError(__filename, "deleteCategory", error);
            this.errorResponse(res, "!Ops, Something went wrong");
        }
    }
}

export default new CategoryController();