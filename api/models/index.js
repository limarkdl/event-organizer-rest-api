import User from "./User.js";
import sequelize from "../sequelize.config.js";
import Reservation from "./Reservation.js";
import Organizer from "./Organizer.js";
import EventType from "./EventType.js";
import Event from "./Event.js";

User.hasMany(Reservation, { foreignKey: 'userID' });
Reservation.belongsTo(User, { foreignKey: 'userID' });

Event.hasMany(Reservation, { foreignKey: 'eventID' });
Reservation.belongsTo(Event, { foreignKey: 'eventID' });

EventType.hasMany(Event, { foreignKey: 'eventTypeID' });
Event.belongsTo(EventType, { foreignKey: 'eventTypeID' });

Organizer.hasMany(Event, { foreignKey: 'organizerID' });
Event.belongsTo(Organizer, { foreignKey: 'organizerID' });

const db = {
    sequelize,
    User,
    Reservation,
    Organizer,
    EventType,
    Event,
}

export default db;