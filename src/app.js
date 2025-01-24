import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import guestRoutes from './routes/guestRoutes.js';
import whatsappRoutes from "./routes/whatsappRoutes.js";

import "./models/index.js";

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();

// Configurar CORS
app.use(cors({
    origin: [
        process.env.FRONTEND_URL, // Dirección local
        process.env.FRONTEND_NETWORK_URL, // Dirección en la red
    ],
    credentials: true,
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error("Error:", err); // Imprime el error completo en la consola
    res.status(err.status || 500).json({
        message: err.message || "Ocurrió un error en el servidor",
        error: process.env.NODE_ENV === "development" ? err.stack : {}, // Mostrar detalles solo en desarrollo
    });
});

// Rutas de la API
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/events", eventRoutes); // Rutas para eventos
app.use('/api/guest', guestRoutes); // Rutas para invitados
app.use("/api/whatsapp", whatsappRoutes); // Rutas para WhatsApp

export default app;
