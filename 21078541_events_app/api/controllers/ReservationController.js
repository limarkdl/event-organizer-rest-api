import db from "../models/index.js";
import { ValidationRules } from "../../utils/validation/index.js";
import sequelize from "../sequelize.config.js";

class ReservationController {
  static async getAllReservations(req, res) {
    try {
      const reservations = await db.Reservation.findAll({});

      return res.status(200).send(reservations);
    } catch (error) {
      res.handleError(error, 500, "An error occurred.");
    }
  }

  static async createReservation(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const { eventID, userID } = req.body;

      const creationData = { eventID, userID };
      const { error } = ValidationRules.reservationValidationSchema.validate(
        creationData,
        { abortEarly: false },
      );

      if (error) {
        await transaction.rollback();
        return res
          .status(422)
          .send({ errors: error.details.map((msg) => msg.message) });
      }

      const event = await db.Event.findByPk(eventID, { transaction });
      const user = await db.User.findByPk(userID, { transaction });

      if (!event) {
        await transaction.rollback();
        return res.status(404).send({ message: "Event not found." });
      }

      if (!user) {
        await transaction.rollback();
        return res.status(404).send({ message: "User not found." });
      }

      const existingReservation = await db.Reservation.findOne({
        where: { eventID, userID },
        transaction,
      });

      if (existingReservation) {
        await transaction.rollback();
        return res
          .status(422)
          .send({ message: "User already has a reservation for this event." });
      }

      const reservationCount = await db.Reservation.count({
        where: { eventID },
        transaction,
      });

      if (reservationCount >= event.maxParticipants) {
        await transaction.rollback();
        return res
          .status(422)
          .send({ message: "No available slots for this event." });
      }

      const newReservation = await db.Reservation.create(
        { eventID, userID },
        { transaction },
      );

      await transaction.commit();

      return res.status(200).send({
        message: "Reservation successfully created.",
        reservation: newReservation,
      });
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async getReservation(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(422).send({ message: "Invalid reservation ID." });
      }

      const reservation = await db.Reservation.findByPk(id);

      if (!reservation) {
        return res.status(404).send({ message: "Reservation not found." });
      }

      return res.status(200).send(reservation);
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async deleteReservation(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        await transaction.rollback();
        return res.status(422).send({ message: "Invalid reservation ID." });
      }

      const reservation = await db.Reservation.findByPk(id);

      if (!reservation) {
        await transaction.rollback();
        return res.status(404).send({ message: "Reservation not found." });
      }

      await reservation.destroy();
      await transaction.commit();

      return res.status(200).send("OK");
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }
}

export default ReservationController;
