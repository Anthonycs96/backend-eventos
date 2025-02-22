import { v4 as uuidv4 } from "uuid";
import Event from "../models/event.js";
import EventUser from "../models/eventUser.js";
import { io } from "../server.js";

// Crear un evento (y asignar al creador como OWNER en EventUser)
export const createEvent = async (req, res) => {
    try {
        const { userId, ...eventData } = req.body; // Extrae el userId del request
        if (!userId) {
            return res.status(400).json({ error: "Se requiere userId para crear un evento." });
        }

        eventData.id = uuidv4(); // Generar un UUID único para el evento

        // Verificar si ya existe un evento con el mismo nombre
        const existingEvent = await Event.findOne({ where: { name: eventData.name } });
        if (existingEvent) {
            return res.status(400).json({ error: "Ya existe un evento con este nombre." });
        }

        // Crear el nuevo evento
        const event = await Event.create(eventData);

        // Asignar al usuario como OWNER en EventUser
        await EventUser.create({
            id: uuidv4(),
            eventId: event.id,
            userId: userId,
            role: "owner",
        });

        io.emit("new_event", event);
        res.status(201).json(event);
    } catch (err) {
        console.error("Error al crear el evento:", err);
        res.status(500).json({ error: "Error al crear el evento" });
    }
};

// Obtener todos los eventos
export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (err) {
        console.error("Error al obtener eventos:", err);
        res.status(500).json({ error: err.message });
    }
};


// Obtener un evento por ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        res.status(200).json(event);
    } catch (err) {
        console.error("Error al obtener el evento:", err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un evento (Ahora puede actualizar cualquier campo)
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Recibe cualquier campo enviado en el body

        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        // Actualizar dinámicamente los campos
        await event.update(updateData);

        res.status(200).json({ message: "Evento actualizado", event });
    } catch (err) {
        console.error("Error al actualizar el evento:", err);
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un evento
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        await event.destroy();

        // Emitir la eliminación a los clientes
        io.emit("delete_event", id);

        res.status(200).json({ message: "Evento eliminado" });
    } catch (err) {
        console.error("Error al eliminar el evento:", err);
        res.status(500).json({ error: err.message });
    }
};


export const getUserCreatedEvents = async (req, res) => {
    try {
        console.log("🔍 userId recibido en la solicitud:", req.userId);

        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ error: "Se requiere autenticación para obtener eventos." });
        }

        console.log(`🔍 Buscando eventos creados por el usuario: ${userId}`);

        // 🔹 Nueva consulta usando la relación `EventUsers`
        const userEvents = await Event.findAll({
            include: [
                {
                    model: User,
                    as: "eventUsers", // Asegura que coincida con la relación en `relations.js`
                    through: { where: { userId, role: "owner" } },
                    attributes: [],
                },
            ],
            attributes: ["id", "name", "date", "location"],
            logging: console.log // 🔹 Esto imprimirá la consulta SQL en la terminal
        });

        console.log(`📌 Eventos encontrados: ${userEvents.length}`);

        if (userEvents.length === 0) {
            return res.status(404).json({ error: "No has creado ningún evento." });
        }

        return res.status(200).json(userEvents);
    } catch (err) {
        console.error("❌ Error al obtener eventos creados:", err);
        return res.status(500).json({ error: "Error interno al obtener eventos.", details: err.message });
    }
};

