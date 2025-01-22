import db from "../models/index.js"
import {ValidationRules} from "../../utils/validation/index.js"

/**
 * Controller for user-related operations.
 */
class UserController {
    /**
     * Retrieves all users info.
     * @async
     * @param {string} req.query.eventId - Filters users by eventId.
     */
    static async getAllUsers(req, res) {
        try {
            const {eventID} = req.query

            const buildQuery = (eventID) => ({
                include: eventID
                    ? [{
                        model: db.Reservation,
                        where: {eventID},
                    }]
                    : [],
            })

            const queryOptions = buildQuery(eventID)

            const users = await db.User.findAll(queryOptions)

            if (!users || users.length === 0) {
                return res.status(404).send({ message: "No users found." })
            }

            res.status(200).send(users)
        } catch (error) {
            res.handleError(error, 422, 'An error occurred while retrieving users.')
        }
    }

    /**
     * Creates a new user in the system.
     * @async
     * @param {Object} req.body - The request body containing user details.
     * @param {string} req.body.username - The username of the new user.
     * @param {string} req.body.firstname - The first name of the new user.
     * @param {string} req.body.lastname - The last name of the new user.
     */
    static async createUser(req, res) {
        try {
            console.log('Request Body:', req.body)

            const {username, firstname, lastname} = req.body

            const creationData = {
                username: username,
                firstname: firstname,
                lastname: lastname,
            }

            const {error} = ValidationRules.userValidationSchema.validate(creationData, {abortEarly: false})

            if (error) {
                return res.status(422).send({errors: error.details.map(msg => msg.message)})
            }

            const existingUser = await db.User.findOne({where: {username: username}})
            if (existingUser) {
                return res.status(409).send({message: 'Username already exists.'})
            }

            const newUser = await db.User.create(creationData)

            return res.status(200).send({
                message: 'User successfully created.',
                user: newUser
            })

        } catch (error) {
            res.handleError(error, 500, "An internal server error occurred.")
        }
    }

    /**
     * Retrieves user details by ID.
     * @async
     * @param {number} req.params.id - The ID of the user to retrieve.
     */
    static async getUser(req, res) {
        try {
            const {id} = req.params

            if (!id || isNaN(id)) {
                return res.status(422).send({message: 'Invalid ID provided.'})
            }

            const user = await db.User.findByPk(id)

            if (!user) {
                return res.status(404).send({message: 'User not found.'})
            }

            return res.status(200).send(user)

        } catch (error) {
            res.handleError(error, 500, "An internal server error occurred.")
        }
    }

    /**
     * Updates user by ID
     * @async
     * @param {string} req.body.id - The ID of the user to update.
     * @param {string} req.body.username - New username for the user.
     * @param {string} req.body.firstname - New firstname for the user.
     * @param {string} req.body.lastname - New lastname for the user.
     */
    static async updateUser(req, res) {
        try {
            const {id, username, firstname, lastname} = req.body

            if (!id || isNaN(id)) {
                return res.status(422).send({message: 'Invalid ID provided.'})
            }

            const user = await db.User.findByPk(id)
            if (!user) {
                return res.status(404).send({message: 'User not found.'})
            }

            const updateData = {username, firstname, lastname}
            const {error} = ValidationRules.userValidationSchema.validate(updateData, {abortEarly: false})

            if (error) {
                return res.status(422).send({errors: error.details.map(msg => msg.message)})
            }

            await user.update(updateData)

            return res.status(200).send({
                message: 'User successfully updated.',
                user: user
            })

        } catch (error) {
            res.handleError(error, 500, "An internal server error occurred.")
        }
    }

    /**
     * Deletes user by ID
     * @async
     * @param {string} req.query.id - The ID of the user to delete.
     */
    static async deleteUser(req, res) {
        try {
            const {id} = req.query

            if (!id || isNaN(id)) {
                return res.status(422).send({message: 'Invalid ID provided.'})
            }

            const user = await db.User.findByPk(id)
            if (!user) {
                return res.status(404).send({message: 'User not found.'})
            }

            const reservationCount = await db.Reservation.count({where: {userID: id}})
            if (reservationCount > 0) {
                return res.status(422).send({message: 'User cannot be deleted as it has reservations linked to it.'})
            }

            await user.destroy()

            return res.status(200).send({message: 'OK'})

        } catch (error) {
            res.handleError(error, 500, "An internal server error occurred.")
        }
    }
}

export default UserController