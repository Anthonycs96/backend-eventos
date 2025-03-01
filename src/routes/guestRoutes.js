import express from "express";
import {
    createGuest,
    getGuests,
    getGuestById,
    updateGuest,
    deleteGuest, confirmAssistance
} from "../controllers/guestController.js";

const router = express.Router();

// Crear un invitado
router.post("/", createGuest);

// Obtener todos los invitados de un evento
router.get("/:eventId", getGuests);

// Obtener un invitado específico
router.get("/consultar/:id", getGuestById);

// Actualizar un invitado
router.put("/:id", updateGuest);

// Eliminar un invitado
router.delete("/delete/:id", deleteGuest);
// Ruta para confirmar la asistencia
router.post("/confirm/:invitationUrl", confirmAssistance);

export default router;
