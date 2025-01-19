import express from "express";

const ReservationRouter = new express.Router();


ReservationRouter.get('/list', ReservationController.getAllReservations);

ReservationRouter.post('/create', ReservationController.createReservation);

ReservationRouter.get('/:id', ReservationController.getReservation);

ReservationRouter.delete('/delete', ReservationController.deleteReservation);


export default ReservationRouter;