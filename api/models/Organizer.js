import sequelize from "../sequelize.config.js";
import {DataTypes} from "sequelize";

export const Organizer = sequelize.define('Organizer', {
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

console.log(Organizer === sequelize.models.Organizer);

export default Organizer;
