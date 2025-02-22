import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        type: {
            type: DataTypes.ENUM("private", "public"),
            defaultValue: "private",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        songUrl: {
            type: DataTypes.STRING, // 🎵 URL de la canción
            allowNull: true,
        },
        secondaryImages: {
            type: DataTypes.TEXT, // 🔥 Se almacena como JSON en MySQL
            allowNull: true,
            get() {
                const value = this.getDataValue("secondaryImages");
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue("secondaryImages", JSON.stringify(value));
            },
        },
    },
    { timestamps: true }
);

export default Event;
