import express from "express";

const OrganizerRouter = new express.Router();


OrganizerRouter.get('/list', OrganizerController.getAllOrganizers);

OrganizerRouter.post('/create', OrganizerController.createOrganizer);

OrganizerRouter.delete('/delete', OrganizerController.deleteOrganizer);


export default OrganizerRouter;