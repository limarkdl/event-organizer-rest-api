import sequelize from "../sequelize.config.js";
import {DataTypes} from "sequelize";

export const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

console.log(Reservation === sequelize.models.Reservation);

export default Reservation;
