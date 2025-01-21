import express from "express"
import OrganizerController from "../controllers/OrganizerController.js"
import Middleware from "../../utils/middleware/middleware.js"

const OrganizerRouter = new express.Router()


OrganizerRouter.get('/list', OrganizerController.getAllOrganizers)

OrganizerRouter.post('/create', Middleware.contentTypeJsonValidator, OrganizerController.createOrganizer)

OrganizerRouter.delete('/delete', OrganizerController.deleteOrganizer)


export default OrganizerRouter