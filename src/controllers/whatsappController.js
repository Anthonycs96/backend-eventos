import {
    initializeWhatsAppForUser,
    sendMessageForUser,
    disconnectWhatsAppForUser,
    clientStatus
} from "../services/whatsappService.js";

export const connectWhatsApp = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "El userId es obligatorio." });
    }

    try {
        console.log(`Iniciando conexión de WhatsApp para userId: ${userId}`);
        await initializeWhatsAppForUser(userId);
        res.status(200).json({ message: "WhatsApp inicializado correctamente." });
    } catch (err) {
        console.error(`Error conectando WhatsApp para ${userId}:`, err);
        res.status(500).json({ error: "Error al inicializar WhatsApp.", details: err.message });
    }
};

export const getWhatsAppStatus = async (req, res) => {
    console.log("userId recibido en getWhatsAppStatus:", req.query.userId);
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "El userId es obligatorio. Asegúrate de enviarlo en la consulta." });
    }

    const status = clientStatus[userId] || "disconnected";
    const isConnected = status === "connected";

    console.log(`Estado de WhatsApp para userId ${userId}: ${status}`);
    res.status(200).json({ isConnected, status });
};

export const sendUserMessage = async (req, res) => {
    const { userId, phone, text } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "El userId es obligatorio." });
    }
    if (!phone) {
        return res.status(400).json({ error: "El número de teléfono es obligatorio." });
    }
    if (!text) {
        return res.status(400).json({ error: "El mensaje no puede estar vacío." });
    }

    try {
        console.log(`Enviando mensaje a ${phone} desde userId: ${userId}`);
        await sendMessageForUser(userId, phone, text);
        res.status(200).json({ message: "Mensaje enviado correctamente." });
    } catch (err) {
        console.error(`Error enviando mensaje para ${userId} a ${phone}:`, err);
        res.status(500).json({ error: "Error al enviar el mensaje.", details: err.message });
    }
};
