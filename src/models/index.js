import sequelize from "../config/db.js";
import User from "./user.js";
import Event from "./event.js";
import Guest from "./guest.js";
import Message from "./message.js";

// Relación: Un usuario puede crear muchos eventos
User.hasMany(Event, { foreignKey: "userId", onDelete: "CASCADE" });
Event.belongsTo(User, { foreignKey: "userId" });

// Relación: Un evento tiene muchos invitados
Event.hasMany(Guest, { foreignKey: "eventId", onDelete: "SET NULL", onUpdate: "CASCADE" });
Guest.belongsTo(Event, { foreignKey: "eventId" });

// Relación: Un invitado puede tener muchos mensajes
Guest.hasMany(Message, { foreignKey: "guestId", onDelete: "CASCADE" });
Message.belongsTo(Guest, { foreignKey: "guestId" });

// Sincronización de modelos con la base de datos
sequelize.sync({ alter: true }).then(() => {
    console.log("Base de datos sincronizada.");
});

export { sequelize, User, Event, Guest, Message };
