import sequelize from "../sequelize.config.js";
import {DataTypes} from "sequelize";

export const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
});

console.log(Reservation === sequelize.models.Reservation);

export default Reservation;
