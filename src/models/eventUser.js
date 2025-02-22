import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Event from "./event.js";
import User from "./user.js";

const EventUser = sequelize.define(
    "EventUser",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,  // Genera un UUID automáticamente
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Event,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        userId: {
            type: DataTypes.UUID,  // Asegúrate de que esto sea UUID
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        role: {
            type: DataTypes.ENUM("owner", "admin", "viewer"),
            allowNull: false,
            defaultValue: "admin",
        },
    },
    { timestamps: true }
);

export default EventUser;
