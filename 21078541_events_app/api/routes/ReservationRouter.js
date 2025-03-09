import express from "express";
import ReservationController from "../controllers/ReservationController.js";

const ReservationRouter = new express.Router();

ReservationRouter.get("/", ReservationController.getAllReservations);

ReservationRouter.post("/create", ReservationController.createReservation);

ReservationRouter.get("/:id", ReservationController.getReservation);

ReservationRouter.delete(
  "/delete/:id",
  ReservationController.deleteReservation,
);

export default ReservationRouter;
