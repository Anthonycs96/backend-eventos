import Event from "../models/event.js";
import { io } from "../server.js"; // Importa la instancia de Socket.IO

// Crear un evento
export const createEvent = async (req, res) => {
    try {
        const { name, description, date, location, capacity } = req.body;

        const event = await Event.create({ name, description, date, location, capacity });

        // Emitir el evento a todos los clientes conectados
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

// Actualizar un evento
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, date, location, capacity } = req.body;

        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        // Actualiza el evento
        event.name = name || event.name;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.capacity = capacity || event.capacity;

        await event.save();

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
