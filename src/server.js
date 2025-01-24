import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

// Remover advertencias de deprecación
process.removeAllListeners("warning"); // Esto suprime las advertencias de deprecación


const PORT = process.env.PORT || 3000;

// Crear un servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);


// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000", // Dirección local
            "http://192.168.0.104:3000" // Dirección de red
        ],
        methods: ["GET", "POST"],
    },
});

// Configurar eventos de conexión de Socket.IO
io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Puedes emitir eventos personalizados aquí si es necesario
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Exportar `io` para usarlo en otros módulos
export { io };

