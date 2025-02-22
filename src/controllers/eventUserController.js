import { v4 as uuidv4 } from "uuid";
import Event from "../models/event.js";
import EventUser from "../models/eventUser.js";
import User from "../models/user.js";
import { io } from "../server.js";

export const getUserCreatedEvents = async (req, res) => {
    try {
        console.log("🔍 userId recibido en la solicitud:", req.userId);

        if (!req.userId) {
            return res.status(401).json({ error: "Se requiere autenticación para obtener eventos." });
        }

        console.log(`🔍 Buscando eventos creados por el usuario: ${req.userId}`);

        // Consulta asegurando la relación con `EventUser`
        const userEvents = await Event.findAll({
            include: [
                {
                    model: EventUser,
                    as: "eventUsers",
                    where: { userId: req.userId, role: "owner" },
                    attributes: [] // No necesitas datos de `EventUser`, así que los excluyes
                }
            ],
            // No definimos "attributes" para obtener todos los atributos del modelo `Event`
        });

        console.log(`📌 Eventos encontrados: ${userEvents.length}`);

        return res.status(200).json(userEvents);

    } catch (err) {
        console.error("❌ Error al obtener eventos creados:", err);

        return res.status(500).json({ error: "Error interno al obtener eventos." });
    }
};

