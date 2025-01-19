import sequelize from "../sequelize.config.js";
import {DataTypes} from "sequelize";

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-zA-Z0-9_]+$/,
            notEmpty: true,
        },
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

console.log(User === sequelize.models.User);

export default User;
