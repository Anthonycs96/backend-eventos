import pkg from "whatsapp-web.js";
const { Client, LocalAuth, NoAuth } = pkg;

import qrcode from "qrcode";
import { io } from "../server.js"; // Importar io desde server.js

const clients = {}; // Objeto para almacenar los clientes de cada usuario
const initializingClients = new Set(); // Seguimiento de clientes en proceso de inicialización

// Inicializa el cliente de WhatsApp para un usuario específico
export const initializeWhatsAppForUser = (userId) => {
    if (clients[userId]) {
        console.log(`Cliente de WhatsApp ya inicializado para el usuario ${userId}`);
        return clients[userId];
    }

    if (initializingClients.has(userId)) {
        console.log(`Cliente de WhatsApp ya está en proceso de inicialización para el usuario ${userId}`);
        return;
    }

    initializingClients.add(userId);

    const client = new Client({
        authStrategy: new NoAuth(),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
    });

    // Evento: Generación del QR
    client.on("qr", async (qr) => {
        console.log(`Generando QR para el usuario ${userId}`);
        try {
            const qrBase64 = await qrcode.toDataURL(qr);
            io.emit("qr", { userId, qr: qrBase64 });
            console.log(`QR emitido en formato Base64 para el usuario ${userId}`);
        } catch (err) {
            console.error("Error al generar el QR en Base64:", err);
        }
    });

    // Evento: Cliente listo
    client.on("ready", () => {
        console.log(`WhatsApp listo para el usuario ${userId}`);
        initializingClients.delete(userId);
    });

    // Evento: Autenticado
    client.on("authenticated", () => {
        console.log(`WhatsApp autenticado para el usuario ${userId}`);
    });

    // Evento: Error de autenticación
    client.on("auth_failure", (msg) => {
        console.error(`Error de autenticación para el usuario ${userId}:`, msg);
        initializingClients.delete(userId);
    });

    // Evento: Cliente desconectado
    client.on("disconnected", async (reason) => {
        console.log(`WhatsApp desconectado para el usuario ${userId}. Razón: ${reason}`);
        delete clients[userId];
        initializingClients.delete(userId);

        try {
            await client.destroy();
            console.log(`Cliente de WhatsApp cerrado correctamente para el usuario ${userId}`);
        } catch (err) {
            console.error(`Error al destruir el cliente para ${userId}: ${err.message}`);
        }

        if (reason === "LOGOUT") {
            console.log("Reiniciando cliente después del LOGOUT...");
            initializeWhatsAppForUser(userId);
        }
    });

    client.initialize();
    clients[userId] = client;

    return client;
};

// Cierra la sesión de WhatsApp para un usuario
export const disconnectWhatsAppForUser = (userId) => {
    const client = clients[userId];

    if (!client) {
        throw new Error("No hay un cliente de WhatsApp activo para este usuario.");
    }

    client.destroy(); // Cierra la conexión
    delete clients[userId]; // Elimina el cliente del objeto
    console.log(`Cliente de WhatsApp cerrado para el usuario ${userId}`);
};

// Envía un mensaje usando el cliente del usuario
export const sendMessageForUser = async (userId, phone, text) => {
    const client = clients[userId];

    if (!client) {
        throw new Error(`Cliente de WhatsApp no inicializado para el usuario ${userId}`);
    }

    const maxRetries = 3; // Número máximo de intentos
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            if (!client.info) {
                throw new Error(`Cliente de WhatsApp no está listo para el usuario ${userId}`);
            }

            await client.sendMessage(`${phone}@c.us`, text);
            console.log(`Mensaje enviado a ${phone} por el usuario ${userId}`);
            return;
        } catch (err) {
            attempt++;
            console.error(`Intento ${attempt} fallido para enviar mensaje: ${err.message}`);
            if (attempt >= maxRetries) {
                throw new Error(`Error enviando mensaje después de ${maxRetries} intentos para el usuario ${userId}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};
