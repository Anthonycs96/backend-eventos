import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid'; // Para generar un UUID único


export const register = async (req, res) => {
    try {
        // Obtener los datos enviados por el cliente
        const { name, phoneNumber, password } = req.body;

        // Verificar si el usuario con ese número de teléfono ya existe
        const existingUser = await User.findOne({ where: { phoneNumber } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this phone number" });
        }

        // Generar un UUID único para el nuevo usuario
        const uniqueId = uuidv4();

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario con los datos proporcionados
        const user = await User.create({
            id: uniqueId,
            name,
            phoneNumber,
            password: hashedPassword, // Usamos la contraseña encriptada
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const login = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body;

        // Buscar usuario por número de teléfono
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Respuesta con token e ID de usuario
        res.status(200).json({
            message: "Login exitoso",
            userId: user.id,
            token
        });
    } catch (err) {
        next(err); // Middleware global manejará errores no controlados
    }
};

