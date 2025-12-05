import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: Token khong ton tai"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return next(new Error("Authentication error: Invalid token - Khong hop le hoac het han"));
        }
        const user = await User.findById(decoded.userId).select("-hashedPassword");

        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = user; // Gắn user vào socket object
        next();
    } catch (error) {
        console.error("Socket authentication error in socketMiddleware:", error);
        next(new Error("Authentication  socket error"));
    }
}