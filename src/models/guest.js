import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Guest = sequelize.define("Guest", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" }, // pending, confirmed, declined
    comments: { type: DataTypes.TEXT },
    invitationUrl: { type: DataTypes.STRING }, // URL personalizada para cada invitado
    qrCodePath: { type: DataTypes.STRING }, // Ruta al archivo QR generado
}, { timestamps: true });
export default Guest;
