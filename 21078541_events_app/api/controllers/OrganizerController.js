import db from "../models/index.js";
import { ValidationRules } from "../../utils/validation/index.js";
import { Sequelize } from "sequelize";
import sequelize from "../sequelize.config.js";

class OrganizerController {
  static async getAllOrganizers(req, res) {
    try {
      const { hasEvents } = req.query;

      let organizers;
      if (hasEvents === undefined) {
        organizers = await db.Organizer.findAll({ attributes: ["id", "name"] });
      } else if (hasEvents === "true") {
        organizers = await db.Organizer.findAll({
          attributes: ["id", "name"],
          include: [
            {
              model: db.Event,
              attributes: ["id"],
              required: true,
            },
          ],
        });
      } else {
        organizers = await db.Organizer.findAll({
          attributes: ["id", "name"],
          include: [
            {
              model: db.Event,
              attributes: ["id"],
              required: false,
            },
          ],
          where: Sequelize.literal(
            `NOT EXISTS (SELECT 1 FROM Events WHERE Events.organizerId = Organizer.id)`,
          ),
        });
      }

      if (!organizers || organizers.length === 0) {
        return res.status(404).send({ message: "No organizers found." });
      }

      return res.status(200).send(organizers);
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async createOrganizer(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(422).send({ error: '"name" is required.' });
      }

      const { error } = ValidationRules.organizerValidationSchema.validate(
        { name },
        { abortEarly: false },
      );

      if (error) {
        return res
          .status(422)
          .send({ errors: error.details.map((msg) => msg.message) });
      }

      const existingOrganizer = await db.Organizer.findOne({
        where: { name: name },
      });
      if (existingOrganizer) {
        return res
          .status(409)
          .send({ message: "Organizer with this name already exists." });
      }

      const newOrganizer = await db.Organizer.create({ name });

      return res.status(200).send({
        message: "Organizer successfully created.",
        organizer: newOrganizer,
      });
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }

  static async deleteOrganizer(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        await transaction.rollback();
        return res.status(422).send({ message: "The ID must be provided." });
      }

      const organizer = await db.Organizer.findByPk(id);

      if (!organizer) {
        await transaction.rollback();
        return res.status(404).send({ message: "Organizer ID wasn't found" });
      }

      const eventCount = await db.Event.count({ where: { organizerId: id } });
      if (eventCount > 0) {
        await transaction.rollback();
        return res.status(422).send({
          message: "Organizer cannot be deleted as it has events linked to it.",
        });
      }

      await organizer.destroy();
      await transaction.commit();

      return res.status(200).send({ message: "OK" });
    } catch (error) {
      res.handleError(error, 500, "An internal server error occurred.");
    }
  }
}

export default OrganizerController;
