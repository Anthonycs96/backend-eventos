import { initializeWhatsAppForUser, sendMessageForUser } from "../services/whatsappService.js";

// Inicializa la sesión de WhatsApp para un usuario
export const connectWhatsApp = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "El userId es obligatorio." });
    }

    try {
        initializeWhatsAppForUser(userId);
        res.status(200).json({ message: "Cliente de WhatsApp inicializado. Escanea el QR en la consola." });
    } catch (err) {
        console.error(`Error conectando WhatsApp para el usuario ${userId}:`, err);
        res.status(500).json({ error: "Error al inicializar el cliente de WhatsApp." });
    }
};

// Envía un mensaje desde el cliente del usuario
export const sendUserMessage = async (req, res) => {
    const { userId, phone, text } = req.body;

    if (!userId || !phone || !text) {
        return res.status(400).json({ error: "userId, phone y text son obligatorios." });
    }

    try {
        await sendMessageForUser(userId, phone, text);
        res.status(200).json({ message: "Mensaje enviado con éxito." });
    } catch (err) {
        console.error(`Error enviando mensaje para el usuario ${userId}:`, err);
        res.status(500).json({ error: "Error al enviar el mensaje." });
    }
};
