import Guest from "../models/guest.js";
import Event from "../models/event.js";
import { io } from "../server.js"; // Instancia de Socket.IO
import { v4 as uuidv4 } from "uuid"; // Para generar un UUID único

// Crear un invitado
export const createGuest = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en el backend:", req.body); // 📌 Depuración

        const {
            name,
            email,
            phone,
            comments,
            eventId,
            status,
            additionalGuestNames,
            suggestedSongs,
            type,  // Asegurar que se recibe
            numberOfGuests,  // Asegurar que se recibe
        } = req.body;

        if (!name || !phone || !eventId) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Verificar si el evento existe
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Generar un UUID único para el invitado
        const uniqueId = uuidv4();

        // Crear el invitado con el UUID único como `id`
        const guest = await Guest.create({
            id: uniqueId, // Usamos el UUID generado como ID del invitado
            name,
            email,
            phone,
            comments,
            eventId,
            status,
            additionalGuestNames,
            suggestedSongs,
            type,  // Asegurar que se guarda
            numberOfGuests,  // Asegurar que se guarda
        });

        // Generar la URL de invitación usando el UUID único y el eventId
        const invitationUrl = `${process.env.FRONTEND_NETWORK_URL}/invitacion/${eventId}/${uniqueId}/tarjeta`;

        // Actualizamos el invitado con la URL generada
        guest.invitationUrl = invitationUrl;
        await guest.save();

        // Emitir el nuevo invitado a través de Socket.IO
        console.log("✅ Invitado creado exitosamente:", guest.toJSON());
        io.emit("new_Guest", guest.toJSON());

        // Responder con el invitado completo
        res.status(201).json(guest);
    } catch (err) {
        console.error("❌ Error al crear el invitado:", err);
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

        // Buscar invitado por su ID único
        const guest = await Guest.findByPk(id);

        // Si no se encuentra el invitado, retornar 404
        if (!guest) {
            console.log(`Invitado con ID ${id} no encontrado.`);
            return res.status(404).json({ message: "Guest not found" });
        }

        // Retornar el invitado encontrado
        console.log(`Invitado encontrado: ${JSON.stringify(guest)}`);
        res.status(200).json(guest);
    } catch (err) {
        console.error("Error al obtener el invitado:", err);
        res.status(500).json({ error: "Error al obtener el invitado" });
    }
};

// Actualizar un invitado dinámicamente
// Actualizar un invitado dinámicamente
export const updateGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID del invitado es requerido" });
        }

        const guest = await Guest.findByPk(id);

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        // Actualizar solo los campos que vienen en el req.body
        await guest.update(updatedFields);

        // Emitir evento de actualización al frontend con el nombre correcto
        const updatedGuest = guest.toJSON();
        io.emit("update_Guest", updatedGuest);

        res.status(200).json({ message: "Guest updated successfully", guest: updatedGuest });
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

// Método para confirmar la asistencia de un invitado
// Método para confirmar la asistencia de un invitado
export const confirmAssistance = async (req, res) => {
    const { invitationUrl } = req.params; // Se usa como ID único para buscar el invitado

    try {
        // Buscar el invitado por su ID
        const guest = await Guest.findByPk(invitationUrl);

        if (!guest) {
            console.log(`Invitado con ID ${invitationUrl} no encontrado.`);
            return res.status(404).json({ error: "Invitado no encontrado." });
        }

        console.log("Invitado encontrado:", guest.toJSON());

        // Actualizar solo los atributos enviados en el body
        Object.entries(req.body).forEach(([key, value]) => {
            // Si el atributo existe en el modelo y no es nulo, se actualiza
            if (value !== undefined) {
                guest[key] = value;
            }
        });


        // Guarda los cambios en la base de datos
        await guest.save();

        console.log("Datos actualizados correctamente:", guest.toJSON());

        res.status(200).json({ message: "Asistencia confirmada exitosamente.", guest });
    } catch (err) {
        console.error("Error al confirmar la asistencia:", err);
        res.status(500).json({ error: "Error al confirmar la asistencia." });
    }
};

// Obtener estadísticas de los invitados del evento
export const getEventGuestStats = async (req, res) => {
    try {
        const { eventId } = req.params;

        const guests = await Guest.findAll({ where: { eventId } });

        const confirmedGuests = guests.filter(g => g.status === "confirmed");
        const pendingGuests = guests.filter(g => g.status === "pending");
        const declinedGuests = guests.filter(g => g.status === "declined");

        const totalConfirmedWithAccompanying = confirmedGuests.reduce(
            (sum, g) => sum + 1 + (g.numberOfGuests || 0), 0
        );

        const totalPendingWithAccompanying = pendingGuests.reduce(
            (sum, g) => sum + 1 + (g.numberOfGuests || 0), 0
        );

        const totalDeclinedWithAccompanying = declinedGuests.reduce(
            (sum, g) => sum + 1 + (g.numberOfGuests || 0), 0
        );

        const totalGeneralWithAccompanying = totalConfirmedWithAccompanying + totalPendingWithAccompanying;

        res.status(200).json({
            totalGeneralWithAccompanying,
            totalDeclinedWithAccompanying,
            totalConfirmedWithAccompanying,
            totalPendingWithAccompanying
        });

    } catch (err) {
        console.error("Error al obtener estadísticas de los invitados:", err);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
};
