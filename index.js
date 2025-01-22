import express from "express"
import sequelize from "./api/sequelize.config.js"
import UserRouter from "./api/routes/UserRouter.js"
import EventRouter from "./api/routes/EventRouter.js"
import OrganizerRouter from "./api/routes/OrganizerRouter.js"
import EventTypeRouter from "./api/routes/EventTypeRouter.js"
import ReservationRouter from "./api/routes/ReservationRouter.js"
import logger from "./utils/logger/logger.js"

const app = express()
const API_BASE = '/api'

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use((req, res, next) => {
    res.handleError = (error, statusCode = 500, message = 'An error occurred') => {
        logger.error({
            message: error.message || 'An error occurred',
            stack: error.stack || 'No stack trace',
            context: error.context || {},
        })

        res.status(statusCode).send(message)
    }

    next()
})


app.get("/", (req, res) => {
    res.render('index', {title: 'Home Page'});
})
app.get("/organizers", (req, res) => {
    res.render('organizers', {title: 'Organizers'});
})
app.get("/users", (req, res) => {
    res.render('users', {title: 'Users'});
})
app.get("/events", (req, res) => {
    res.render('events', {title: 'Events'});
})
app.get("/reservations", (req, res) => {
    res.render('reservations', {title: 'Reservations'});
})
app.get("/event-types", (req, res) => {
    res.render('event-types', {title: 'Event types'});
})

try {
    sequelize.authenticate()
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

app.use(`${API_BASE}/user`, UserRouter)
app.use(`${API_BASE}/organizer`, OrganizerRouter)
app.use(`${API_BASE}/event`, EventRouter)
app.use(`${API_BASE}/event-type`, EventTypeRouter)
app.use(`${API_BASE}/reservation`, ReservationRouter)

app.use((req, res) => {
    res.status(404).render('404')
})

app.listen(3000, () => {
        console.log("Server is running on port 3000")
    }
)

// await sequelize.sync({ force: true })
// console.log("All models were synchronized successfully.")