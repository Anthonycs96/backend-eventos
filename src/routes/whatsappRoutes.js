import express from "express";
import { connectWhatsApp, sendUserMessage } from "../controllers/whatsappController.js";

const router = express.Router();

// Ruta para inicializar la sesión de WhatsApp del usuario
router.post("/connect", connectWhatsApp);

// Ruta para enviar mensajes usando la sesión del usuario
router.post("/send", sendUserMessage);

export default router;
