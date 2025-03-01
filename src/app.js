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

// Configuración de CORS para múltiples orígenes
const allowedOrigins = [
    process.env.FRONTEND_URL,         // http://localhost:3000
    process.env.FRONTEND_NETWORK_URL  // http://192.168.0.102:3000
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    credentials: true, // Permitir cookies y credenciales
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error("Error:", err); // Imprime el error en la consola
    res.status(err.status || 500).json({
        message: err.message || "Ocurrió un error en el servidor",
        error: process.env.NODE_ENV === "development" ? err.stack : {},
    });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/eventUser", eventUserRoutes);
app.use('/api/guest', guestRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Middleware para manejar solicitudes preflight (OPTIONS)
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // No Content
});

export default app;
