import express from "express";

const EventTypeRouter = new express.Router();


EventTypeRouter.get('/list', EventTypeController.getAllEventTypes);

EventTypeRouter.post('/create', EventTypeController.createEventType);

EventTypeRouter.delete('/delete', EventTypeController.deleteEventType);


export default EventTypeRouter;