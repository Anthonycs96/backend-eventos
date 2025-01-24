import { sendMessageForUser } from "../services/whatsappService.js";

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
