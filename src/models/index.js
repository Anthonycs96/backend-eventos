import sequelize from "../config/db.js";
import User from "./user.js";
import Event from "./event.js";
import Guest from "./guest.js";
import Message from "./message.js";
import EventUser from "./eventUser.js";

Event.hasMany(EventUser, { foreignKey: "eventId", as: "eventUsers" });
EventUser.belongsTo(Event, { foreignKey: "eventId" });

User.hasMany(EventUser, { foreignKey: "userId", as: "userEvents" });
EventUser.belongsTo(User, { foreignKey: "userId" });


Event.hasMany(Guest, { foreignKey: "eventId" });
Guest.belongsTo(Event, { foreignKey: "eventId" });

Guest.hasMany(Message, { foreignKey: "guestId" });
Message.belongsTo(Guest, { foreignKey: "guestId" });

// Sincronización de la base de datos (¡usar migraciones en producción!):
sequelize.sync({ alter: true }) // SOLO PARA DESARROLLO
    .then(() => {
        console.log("Base de datos sincronizada.");
    })
    .catch((error) => {
        console.error("Error al sincronizar la base de datos:", error);
    });

export { sequelize, User, Event, Guest, Message, EventUser };