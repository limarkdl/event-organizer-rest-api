import express from "express";
import sequelize from "./api/sequelize.config.js";
import UserRouter from "./api/routes/UserRouter.js";
import EventRouter from "./api/routes/EventRouter.js";
import OrganizerRouter from "./api/routes/OrganizerRouter.js";
import EventTypeRouter from "./api/routes/EventTypeRouter.js";
import ReservationRouter from "./api/routes/ReservationRouter.js";

const app = express();
const API_BASE = '/api'

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

app.use(`${API_BASE}/users`, UserRouter)
app.use(`${API_BASE}/organizer`, OrganizerRouter)
app.use(`${API_BASE}/event`, EventRouter)
app.use(`${API_BASE}/eventType`, EventTypeRouter)
app.use(`${API_BASE}/reservation`, ReservationRouter)

app.listen(3000, () => {
        console.log("Server is running on port 3000");
    }
);

// await sequelize.sync({ force: true });
// console.log("All models were synchronized successfully.");