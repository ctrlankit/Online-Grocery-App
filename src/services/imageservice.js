import fs from "fs";
import path from "path";
import { logError } from "../utils/logger.js";
import Media from "../models/media.model.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
export const uploadMedia = async (image, folderPath, role = "image") => {
    try {
        await fs.promises.mkdir(folderPath, { recursive: true });

        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid base64 image");

        const mimeType = matches[1];
        const ext = mimeType.split("/")[1];
        const buffer = Buffer.from(matches[2], "base64");

        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const filePath = path.join(folderPath, filename);

        await fs.promises.writeFile(filePath, buffer);

        return {
            name: filename,
            type: mimeType,
            size: buffer.length,
            path: filePath,
            role,
        };
    } catch (error) {
        logError(__filename, "uploadMedia", error);
        return false;
    }
};

export const updateMedia = async (mediaData, model) => {
    try {
        const existsMedia = await Media.findOne({
            model_type: model.constructor.modelName,
            model_id: model._id,
            deletedAt: null,
        });

        if (existsMedia) {
            existsMedia.deletedAt = new Date();
            await existsMedia.save();
        }

        const media = new Media({
            model_type: model.constructor.modelName,
            model_id: model._id,
            name: mediaData.name,
            type: mediaData.type,
            role: mediaData.role,
            file_size: mediaData.size,
            created_by: model._id,
            updated_by: model._id,
            path: mediaData.path,
        });

        await media.save();
        return !!media;
    } catch (error) {
        logError(__filename, "updateMedia", error);
        return false;
    }
};

export const createMedia = async (mediaData, model) => {
    console.log("createMEdia", { mediaData, model });
    try {
        const media = new Media({
            model_type: model.constructor.modelName,
            model_id: model._id,
            name: mediaData.name,
            type: mediaData.type,
            role: mediaData.role,
            file_size: mediaData.size,
            created_by: model._id,
            updated_by: model._id,
            path: mediaData.path,
        });

        await media.save();
        return !!media;
    } catch (error) {
        logError(__filename, "createMedia", error);
        return false;
    }
};
