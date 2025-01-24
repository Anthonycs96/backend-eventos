import express from "express";
import {
    createGuest,
    getGuests,
    getGuestById,
    updateGuest,
    deleteGuest,
} from "../controllers/guestController.js";

const router = express.Router();

// Crear un invitado
router.post("/", createGuest);

// Obtener todos los invitados de un evento
router.get("/:eventId", getGuests);

// Obtener un invitado específico
router.get("/guest/:id", getGuestById);

// Actualizar un invitado
router.put("/guest/:id", updateGuest);

// Eliminar un invitado
router.delete("/delete/:id", deleteGuest);

export default router;
