import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventUserRoutes from "./routes/eventUserRoutes.js";
import guestRoutes from './routes/guestRoutes.js';
import whatsappRoutes from "./routes/whatsappRoutes.js";

import "./models/index.js";

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();

// Configurar CORS
app.use(cors({
    origin: [
        process.env.FRONTEND_NETWORK_URL, // Dirección en la red
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permitir métodos necesarios
    credentials: true, // Permitir envío de cookies o credenciales
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir headers necesarios
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error("Error:", err); // Imprime el error completo en la  consola
    res.status(err.status || 500).json({
        message: err.message || "Ocurrió un error en el servidor",
        error: process.env.NODE_ENV === "development" ? err.stack : {}, // Mostrar detalles solo en desarrollo
    });
});

// Rutas de la API
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/events", eventRoutes); // Rutas para eventos
app.use("/api/eventUser", eventUserRoutes); // Rutas para eventos
app.use('/api/guest', guestRoutes); // Rutas para invitados
app.use("/api/whatsapp", whatsappRoutes); // Rutas para WhatsApp

// Middleware para manejar solicitudes preflight (OPTIONS)
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // No Content
});

export default app;
