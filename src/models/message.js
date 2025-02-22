import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        text: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM("pending", "sent", "failed"), defaultValue: "pending" },
        sentAt: { type: DataTypes.DATE, allowNull: true },
        attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
        channel: {
            type: DataTypes.ENUM("whatsapp", "email", "sms"),
            allowNull: false,
            defaultValue: "whatsapp",
        },
    },
    { timestamps: true }
);

export default Message;
