import express from "express"
import UserController from "../controllers/UserController.js"
import Middleware from "../../utils/middleware/middleware.js"


const UserRouter = new express.Router()


UserRouter.get('/list', UserController.getAllUsers)

UserRouter.post('/create', Middleware.contentTypeJsonValidator, UserController.createUser)

UserRouter.get('/:id', UserController.getUser)

UserRouter.put('/update', Middleware.contentTypeJsonValidator, UserController.updateUser)

UserRouter.delete('/delete', UserController.deleteUser)


export default UserRouter