import { Sequelize } from "sequelize"

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "api/database/database.sqlite",
})

export default sequelize