import pkg from "whatsapp-web.js";
const { Client, LocalAuth, NoAuth } = pkg;

import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

const clients = {}; // Objeto para almacenar los clientes de cada usuario

// Función para eliminar la carpeta de sesión de forma segura
const deleteFolder = (folderPath) => {
    try {
        // Quitar el atributo "solo lectura"
        fs.chmodSync(folderPath, 0o777); // Otorgar permisos completos
        // Eliminar la carpeta
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`Carpeta eliminada correctamente: ${folderPath}`);
    } catch (err) {
        console.error(`Error al eliminar carpeta: ${err.message}`);
    }
};

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
    client.on("qr", (qr) => {
        console.log(`Generando QR para el usuario ${userId}`);
        qrcode.generate(qr, { small: true });
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
