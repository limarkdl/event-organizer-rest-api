import db from "../models/index.js";
import { ValidationRules } from "../../utils/validation/index.js";
import { Op } from "sequelize";

class EventController {
  static async getAllEvents(req, res) {
    try {
      const { organizerID, eventTypeID, dateTime, userIDs } = req.query;

      const conditions = {};

      if (organizerID) {
        const organizer = await db.Organizer.findByPk(organizerID);
        if (!organizer) {
          return res.status(404).send({ message: "Organizer not found." });
        }
        conditions.organizerID = organizerID;
      }

      if (eventTypeID) {
        const eventType = await db.EventType.findByPk(eventTypeID);
        if (!eventType) {
          return res.status(404).send({ message: "Event type not found." });
        }
        conditions.eventTypeID = eventTypeID;
      }

      if (dateTime) {
        const timestamp = parseInt(dateTime, 10);
        if (isNaN(timestamp)) {
          return res.status(422).send({ message: "Invalid dateTime format." });
        }
        conditions.dateTime = { [Op.gte]: timestamp };
      }

      let includeUsers = [];
      if (userIDs) {
        const userIdList = userIDs.split(",").map((id) => parseInt(id, 10));
        if (userIdList.some(isNaN)) {
          return res.status(422).send({ message: "Invalid userIDs format." });
        }
        includeUsers = [
          {
            model: db.Reservation,
            where: { userID: { [Op.in]: userIdList } },
            include: [{ model: db.User }],
          },
        ];
      }

      const events = await db.Event.findAll({
        where: conditions,
        include: [
          { model: db.EventType },
          { model: db.Organizer },
          ...includeUsers,
        ],
      });

      return res.status(200).send(events);
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async createEvent(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const {
        eventTypeID,
        organizerID,
        name,
        price,
        dateTime,
        locationLatitude,
        locationLongitude,
        maxParticipants,
      } = req.body;

      const creationData = {
        eventTypeID,
        organizerID,
        name,
        price,
        dateTime,
        locationLatitude,
        locationLongitude,
        maxParticipants,
        numOfParticipants: 0,
      };

      const { error } = ValidationRules.eventValidationSchema.validate(
        creationData,
        { abortEarly: false },
      );

      if (error) {
        await transaction.rollback();
        return res
          .status(422)
          .send({ errors: error.details.map((msg) => msg.message) });
      }

      const eventType = await db.EventType.findByPk(eventTypeID, {
        transaction,
      });
      if (!eventType) {
        await transaction.rollback();
        return res.status(422).send({ message: "eventTypeID was not found." });
      }

      const organizer = await db.Organizer.findByPk(organizerID, {
        transaction,
      });
      if (!organizer) {
        await transaction.rollback();
        return res.status(422).send({ message: "organizerID was not found." });
      }

      const newEvent = await db.Event.create(creationData, { transaction });

      await transaction.commit();

      return res.status(200).send({
        message: "Event successfully created.",
        event: newEvent,
      });
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async getEvent(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id, 10))) {
        return res.status(422).send({ message: "Invalid event ID." });
      }

      const event = await db.Event.findByPk(id, {
        include: [
          { model: db.EventType },
          { model: db.Organizer },
          { model: db.Reservation, include: [{ model: db.User }] },
        ],
      });

      if (!event) {
        return res.status(404).send({ message: "Event not found." });
      }

      return res.status(200).send(event);
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async updateEvent(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const { id, ...updateData } = req.body;

      if (!id || isNaN(parseInt(id, 10))) {
        await transaction.rollback();
        return res.status(422).send({ message: "Invalid event ID." });
      }

      const event = await db.Event.findByPk(id, { transaction });

      if (!event) {
        await transaction.rollback();
        return res.status(404).send({ message: "Event not found." });
      }

      const { error } = ValidationRules.eventValidationSchema.validate(
        updateData,
        { abortEarly: false },
      );

      if (error) {
        await transaction.rollback();
        return res
          .status(422)
          .send({ errors: error.details.map((msg) => msg.message) });
      }

      if (updateData.eventTypeID) {
        const eventType = await db.EventType.findByPk(updateData.eventTypeID, {
          transaction,
        });
        if (!eventType) {
          await transaction.rollback();
          return res
            .status(422)
            .send({ message: "eventTypeID was not found." });
        }
      }

      if (updateData.organizerID) {
        const organizer = await db.Organizer.findByPk(updateData.organizerID, {
          transaction,
        });
        if (!organizer) {
          await transaction.rollback();
          return res
            .status(422)
            .send({ message: "organizerID was not found." });
        }
      }

      await db.Event.update(updateData, {
        where: { id },
        transaction,
      });

      await transaction.commit();

      const updatedEvent = await db.Event.findByPk(id, {
        include: [{ model: db.EventType }, { model: db.Organizer }],
      });

      return res.status(200).send(updatedEvent);
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async deleteEvent(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id, 10))) {
        await transaction.rollback();
        return res.status(422).send({ message: "Invalid event ID." });
      }

      const event = await db.Event.findByPk(id, { transaction });

      if (!event) {
        await transaction.rollback();
        return res.status(404).send({ message: "Event not found." });
      }

      const reservationCount = await db.Reservation.count({
        where: { eventID: id },
        transaction,
      });

      if (reservationCount > 0) {
        await transaction.rollback();
        return res.status(422).send({
          message:
            "Event cannot be deleted because it is referenced by reservations.",
        });
      }

      await db.Event.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();

      return res.status(200).send("OK");
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }
}

export default EventController;
