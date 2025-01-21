import sequelize from "../sequelize.config.js"
import {DataTypes} from "sequelize"

export const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    dateTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    locationLatitude: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    locationLongitude: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

console.log(Event === sequelize.models.Event)

export default Event
