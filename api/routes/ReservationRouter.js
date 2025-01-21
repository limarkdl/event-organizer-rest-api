import express from "express"
import ReservationController from "../controllers/ReservationController.js"

const ReservationRouter = new express.Router()


ReservationRouter.get('/list', ReservationController.getAllReservations)

ReservationRouter.post('/create', ReservationController.createReservation)

ReservationRouter.get('/:id', ReservationController.getReservation)

ReservationRouter.delete('/delete', ReservationController.deleteReservation)


export default ReservationRouter