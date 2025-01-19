import sequelize from "../sequelize.config.js";
import {DataTypes} from "sequelize";

export const EventType = sequelize.define('EventType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

console.log(EventType === sequelize.models.EventType);

export default EventType;
