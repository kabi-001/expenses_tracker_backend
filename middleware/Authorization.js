import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

export const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER =", authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Token not found" });
    }

    const parts = authHeader.split(" ");
    if (parts.length < 2) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    if (!token || token === "null" || token === "undefined" || typeof token !== "string" || token.trim() === "") {
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        if (!process.env.secretkey) {
            console.error("JWT secretkey is not set in environment");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.secretkey);

        console.log("decoded", decoded);

        if (!decoded._id && decoded.email) {
            const userRecord = await User.findOne({ email: decoded.email }).select("_id");
            if (userRecord) {
                decoded._id = userRecord._id;
            }
        }

        if (!decoded._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(401).json({ message: "Unauthorized" });
    }
};