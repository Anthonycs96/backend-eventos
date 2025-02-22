import express from "express";
import { getUserCreatedEvents } from "../controllers/eventUserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definir la ruta para obtener eventos creados por el usuario autenticado
router.get("/created", authMiddleware, getUserCreatedEvents);

export default router;
