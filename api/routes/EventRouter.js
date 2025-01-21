import express from "express"
import EventController from "../controllers/EventController.js"

const EventRouter = new express.Router()


EventRouter.get('/list', EventController.getAllEvents)

EventRouter.post('/create', EventController.createEvent)

EventRouter.get('/:id', EventController.getEvent)

EventRouter.put('/update', EventController.updateEvent)

EventRouter.delete('/delete', EventController.deleteEvent)


export default EventRouter