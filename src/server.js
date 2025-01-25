import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

// Remover advertencias de deprecación
process.removeAllListeners("warning"); // Suprime las advertencias de deprecación

const PORT = process.env.PORT;

// Crear un servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);

// Configurar Socket.IO con soporte para CORS
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL, // Frontend local
            process.env.FRONTEND_NETWORK_URL, // Dirección en red
        ],
        methods: ["GET", "POST"],
    },
});


// Configurar eventos de conexión de Socket.IO
io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Escuchar eventos personalizados si es necesario
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

// Exportar `io` para usarlo en otros módulos
export { io };

// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor escuchando en ${`http://192.168.0.104:${PORT}`}`);
});
