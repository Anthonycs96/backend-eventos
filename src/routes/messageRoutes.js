import express from "express";
import { sendGuestMessage } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Validar los datos antes de pasar al controlador
const validateMessageData = (req, res, next) => {
    const { phone, text } = req.body;
    if (!phone || !text) {
        return res.status(400).json({ error: "Phone and text fields are required" });
    }
    next();
};

router.post("/", authMiddleware, validateMessageData, sendGuestMessage);

export default router;
