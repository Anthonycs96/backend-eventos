import express from "express";
import { connectWhatsApp, sendUserMessage, getWhatsAppStatus } from "../controllers/whatsappController.js";

const router = express.Router();

// Ruta para conectar WhatsApp
router.post("/connect", connectWhatsApp);

// Ruta para obtener el estado de WhatsApp
router.get("/status", getWhatsAppStatus);

// Ruta para enviar un mensaje de WhatsApp
router.post("/send", sendUserMessage);

export default router;