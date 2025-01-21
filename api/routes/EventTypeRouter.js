import express from "express"
import EventTypeController from "../controllers/EventTypeController.js"

const EventTypeRouter = new express.Router()


EventTypeRouter.get('/list', EventTypeController.getAllEventTypes)

EventTypeRouter.post('/create', EventTypeController.createEventType)

EventTypeRouter.delete('/delete', EventTypeController.deleteEventType)


export default EventTypeRouter