import db from "../models/index.js";

class EventTypeController {
  static async getAllEventTypes(req, res) {
    try {
      const eventTypes = await db.EventType.findAll();

      if (!eventTypes || eventTypes.length === 0) {
        return res.status(404).send({ message: "No event types found." });
      }

      return res.status(200).send(eventTypes);
    } catch (error) {
      return res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async createEventType(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const { name } = req.body;

      if (!name || name.length < 2 || name.length > 255) {
        await transaction.rollback();
        return res.status(422).send({
          message:
            'The "name" field is required and must be between 2 and 255 characters long.',
        });
      }

      const existingEventType = await db.EventType.findOne({ where: { name } });
      if (existingEventType) {
        await transaction.rollback();
        return res
          .status(409)
          .send({ message: "An event type with this name already exists." });
      }

      const newEventType = await db.EventType.create({ name });

      await transaction.commit();

      return res.status(200).send({
        message: "Event type successfully created.",
        eventType: newEventType,
      });
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async deleteEventType(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        await transaction.rollback();
        return res.status(422).send({ message: "Invalid ID provided." });
      }

      const eventType = await db.EventType.findByPk(id);
      if (!eventType) {
        await transaction.rollback();
        return res.status(404).send({ message: "Event type not found." });
      }

      const linkedEvents = await db.Event.count({ where: { eventTypeId: id } });
      if (linkedEvents > 0) {
        await transaction.rollback();
        return res.status(422).send({
          message:
            "Event type cannot be deleted as it has events linked to it.",
        });
      }

      await eventType.destroy();

      await transaction.commit();

      return res.status(200).send({ message: "OK" });
    } catch (error) {
      await transaction.rollback();
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }
}

export default EventTypeController;
