import Guest from "../models/guest.js";
import Event from "../models/event.js";
import { io } from "../server.js"; // Instancia de Socket.IO

// Crear un invitado

export const createGuest = async (req, res) => {
    try {
        const { name, email, phone, comments, eventId, status } = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const guest = await Guest.create({ name, email, phone, comments, eventId, status });

        console.log("Emitiendo nuevo invitado:", guest.toJSON());
        io.emit("new_Guest", guest.toJSON());

        res.status(201).json(guest);
    } catch (err) {
        console.error("Error al crear el invitado:", err);
        res.status(500).json({ error: "Error al crear el invitado" });
    }
};

// Obtener todos los invitados de un evento
export const getGuests = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Buscar todos los invitados relacionados con el ID del evento
        const guests = await Guest.findAll({ where: { eventId } });

        res.status(200).json(guests);
    } catch (err) {
        console.error("Error al obtener los invitados:", err);
        res.status(500).json({ error: err.message });
    }
};

// Obtener un invitado por ID
export const getGuestById = async (req, res) => {
    try {
        const { id } = req.params;

        const guest = await Guest.findByPk(id);

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        res.status(200).json(guest);
    } catch (err) {
        console.error("Error al obtener el invitado:", err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un invitado
export const updateGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, status } = req.body;

        const guest = await Guest.findByPk(id);

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        // Actualizar el invitado con los nuevos datos
        await guest.update({ name, email, phone, status });

        // Emitir un evento para actualizar en tiempo real si es necesario
        io.emit("guest_Updated", guest);

        res.status(200).json({ message: "Guest updated", guest });
    } catch (err) {
        console.error("Error al actualizar el invitado:", err);
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un invitado
export const deleteGuest = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Solicitando eliminación del invitado con ID:", id);

        const guest = await Guest.findByPk(id);
        if (!guest) {
            console.log("Invitado no encontrado");
            return res.status(404).json({ message: "Guest not found" });
        }

        await guest.destroy();
        console.log("Invitado eliminado:", id);

        io.emit("guest_Deleted", { id });
        res.status(200).json({ message: "Guest deleted" });
    } catch (err) {
        console.error("Error al eliminar el invitado:", err);
        res.status(500).json({ error: err.message });
    }
};

