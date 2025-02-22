import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Guest = sequelize.define(
    "Guest",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: false },
        status: {
            type: DataTypes.ENUM("pending", "confirmed", "declined"),
            defaultValue: "pending",
        },
        confirmedAt: { type: DataTypes.DATE, allowNull: true },
        declinedAt: { type: DataTypes.DATE, allowNull: true },
        invitationUrl: { type: DataTypes.STRING },
        qrCodePath: { type: DataTypes.STRING },
        numberOfGuests: {
            type: DataTypes.INTEGER,
            allowNull: true,  // ✅ Permitir valores null
            defaultValue: null,  // ✅ Evitar que se asigne 1 automáticamente
        },
        tableNumber: { type: DataTypes.INTEGER, allowNull: true },
        personalMessage: { type: DataTypes.TEXT, allowNull: true },
        type: {
            type: DataTypes.ENUM("principal", "familiar", "amigo", "proveedor"),
            allowNull: true,  // ✅ Permitir valores null
            defaultValue: null,  // ✅ Evitar que se asigne "amigo" automáticamente
        },
        additionalGuestNames: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue("additionalGuestNames");
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue("additionalGuestNames", JSON.stringify(value));
            },
        },
        suggestedSongs: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue("suggestedSongs");
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue("suggestedSongs", JSON.stringify(value));
            },
        },
    },
    { timestamps: true }
);

export default Guest;
