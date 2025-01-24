import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";

const router = Router();

// Crear un evento
router.post("/", authMiddleware, createEvent);

// Obtener todos los eventos
router.get("/", authMiddleware, getEvents);

// Obtener un evento por ID
router.get("/:id", authMiddleware, getEventById);

// Actualizar un evento
router.put("/:id", authMiddleware, updateEvent);

// Eliminar un evento
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
