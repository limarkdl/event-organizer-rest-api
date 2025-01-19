import express from "express";
import sequelize from "./api/sequelize.config.js";

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render('index');
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.listen(3000, () => {
        console.log("Server is running on port 3000");
    }
);

// await sequelize.sync({ force: true });
// console.log("All models were synchronized successfully.");