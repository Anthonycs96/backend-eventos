import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("❌ No se proporcionó token");
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decodificado:", decoded); // Verifica el contenido del token

        if (!decoded.id) {
            console.log("❌ El token no contiene un ID de usuario válido.");
            return res.status(401).json({ message: "Invalid token structure" });
        }

        req.userId = decoded.id;
        console.log(`✅ Usuario autenticado con ID: ${req.userId}`);
        next();
    } catch (err) {
        console.log("❌ Error al verificar el token:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
