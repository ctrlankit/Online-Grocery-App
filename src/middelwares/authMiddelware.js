import AuthToken from "../models/auth.token.js";
import { logError } from "../utils/logger.js";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);

const authMiddelware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const checkToken = await AuthToken.where({ token: token })
        .where({ revoked: false })
        .findOne();
      if (!checkToken)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    }
  } catch (error) {
    logError(__filename, "getProfile", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddelware;
