import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Event = sequelize.define("Event", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: "private" },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });
export default Event;

