import pkg from "whatsapp-web.js";
const { Client, LocalAuth, NoAuth } = pkg;

import qrcode from "qrcode";
import { io } from "../server.js"; // Importar io desde server.js
import fs from "fs";
import path from "path";

const clients = {}; // Objeto para almacenar los clientes de cada usuario



// Inicializa el cliente de WhatsApp para un usuario específico
export const initializeWhatsAppForUser = (userId) => {
    if (clients[userId]) {
        console.log(`Cliente de WhatsApp ya inicializado para el usuario ${userId}`);
        return clients[userId];
    }

    const client = new Client({
        authStrategy: new NoAuth(), // Cambia LocalAuth por NoAuth
        puppeteer: {
            headless: true, // Ejecutar en modo sin cabeza
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Solucionar posibles problemas en entornos protegidos
        },
    });


    // Evento: Generación del QR
    client.on("qr", async (qr) => {
        console.log(`Generando QR para el usuario ${userId}`);
        try {
            const qrBase64 = await qrcode.toDataURL(qr);
            io.emit("qr", { userId, qr: qrBase64 }); // Emitir el QR al frontend
            console.log(`QR emitido en formato Base64 para el usuario ${userId}`);
        } catch (err) {
            console.error("Error al generar el QR en Base64:", err);
        }
    });


    // Evento: Cliente listo
    client.on("ready", () => {
        console.log(`WhatsApp listo para el usuario ${userId}`);
    });

    // Evento: Autenticado
    client.on("authenticated", () => {
        console.log(`WhatsApp autenticado para el usuario ${userId}`);
    });

    // Evento: Error de autenticación
    client.on("auth_failure", (msg) => {
        console.error(`Error de autenticación para el usuario ${userId}:`, msg);
    });

    // Evento: Cliente desconectado
    client.on("disconnected", async (reason) => {
        console.log(`WhatsApp desconectado para el usuario ${userId}. Razón: ${reason}`);
        delete clients[userId]; // Eliminar cliente del objeto en memoria

        // Intentar cerrar Puppeteer de forma segura
        try {
            await client.destroy();
            console.log(`Cliente de WhatsApp cerrado correctamente para el usuario ${userId}`);
        } catch (err) {
            console.error(`Error al destruir el cliente para ${userId}: ${err.message}`);
        }

        // Opcional: Reiniciar el cliente si es necesario
        if (reason === "LOGOUT") {
            console.log("Reiniciando cliente después del LOGOUT...");
            initializeWhatsAppForUser(userId); // Volver a inicializar el cliente
        }
    });


    client.initialize();
    clients[userId] = client;

    return client;
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
            // Verificar si el cliente está listo antes de enviar
            if (!client.info) {
                throw new Error(`Cliente de WhatsApp no está listo para el usuario ${userId}`);
            }

            await client.sendMessage(`${phone}@c.us`, text); // Enviar mensaje
            console.log(`Mensaje enviado a ${phone} por el usuario ${userId}`);
            return; // Salir si el mensaje fue enviado con éxito
        } catch (err) {
            attempt++;
            console.error(`Intento ${attempt} fallido para enviar mensaje: ${err.message}`);
            if (attempt >= maxRetries) {
                throw new Error(`Error enviando mensaje después de ${maxRetries} intentos para el usuario ${userId}`);
            }

            // Esperar un tiempo antes de reintentar
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};
