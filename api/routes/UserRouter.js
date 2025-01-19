import express from "express";

const UserRouter = new express.Router();


UserRouter.get('/list', UserController.getAllUsers);

UserRouter.post('/create', UserController.createUser);

UserRouter.get('/:id', UserController.getUser);

UserRouter.put('/update', UserController.updateUser);

UserRouter.delete('/delete', UserController.deleteUser);


export default UserRouter;