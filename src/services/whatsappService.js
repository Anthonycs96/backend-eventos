import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode";
import { io } from "../server.js";

const clients = {}; // Objeto con los clientes de WhatsApp por usuario
const clientStatus = {}; // Estado de cada cliente

export const initializeWhatsAppForUser = async (userId) => {
    if (clients[userId] && clientStatus[userId] === "connected") {
        console.log(`WhatsApp ya conectado para ${userId}`);
        io.emit("status", { userId, status: "connected" });
        return clients[userId];
    }

    clientStatus[userId] = "initializing";

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: userId }),
        puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] },
    });

    client.on("qr", async (qr) => {
        if (clientStatus[userId] === "connected") return;
        console.log(`Generando QR para ${userId}`);
        const qrBase64 = await qrcode.toDataURL(qr);
        io.emit("qr", { userId, qr: qrBase64 });
    });

    client.on("ready", () => {
        console.log(`WhatsApp conectado para ${userId}`);
        clientStatus[userId] = "connected";
        io.emit("status", { userId, status: "connected" });
    });

    client.on("authenticated", () => {
        console.log(`WhatsApp autenticado para ${userId}`);
        io.emit("status", { userId, status: "authenticated" });
    });

    client.on("auth_failure", () => {
        console.error(`Error de autenticación para ${userId}`);
        clientStatus[userId] = "disconnected";
    });

    client.on("disconnected", async (reason) => {
        console.log(`WhatsApp desconectado para ${userId}: ${reason}`);
        clientStatus[userId] = "disconnected";
        delete clients[userId];

        try {
            await client.destroy();
        } catch (err) {
            console.error(`Error al destruir sesión de ${userId}: ${err.message}`);
        }

        if (reason === "LOGOUT") {
            console.log(`Reiniciando sesión de ${userId}...`);
            setTimeout(() => initializeWhatsAppForUser(userId), 5000);
        }
    });

    client.initialize();
    clients[userId] = client;

    return client;
};

// Desconectar WhatsApp de un usuario
export const disconnectWhatsAppForUser = async (userId) => {
    const client = clients[userId];

    if (!client) {
        throw new Error("No hay una sesión activa para este usuario.");
    }

    await client.logout();
    await client.destroy();
    delete clients[userId];
    clientStatus[userId] = "disconnected";
    io.emit("status", { userId, status: "disconnected" });
};

// Enviar mensaje de WhatsApp
export const sendMessageForUser = async (userId, phone, text) => {
    let client = clients[userId];

    if (!client || clientStatus[userId] !== "connected") {
        client = await initializeWhatsAppForUser(userId);
    }

    try {
        await client.sendMessage(`${phone}@c.us`, text);
        console.log(`Mensaje enviado a ${phone} desde ${userId}`);
    } catch (err) {
        console.error(`Error enviando mensaje para ${userId}: ${err.message}`);
        throw err;
    }
};

// ✅ Exportamos `clientStatus` para que pueda usarse en `whatsappController.js`
export { clients, clientStatus };
