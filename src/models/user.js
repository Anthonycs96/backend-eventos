import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Genera un UUID automáticamente
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        oauthProvider: {
            type: DataTypes.ENUM("google", "facebook", "none"),
            defaultValue: "none",
        },
        oauthId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM("admin", "organizer", "guest"),
            defaultValue: "organizer",
        },
    },
    { timestamps: true }
);

export default User;
