import Joi from 'joi'

export const userValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(1)
        .required()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters.',
            'string.empty': 'Username cannot be empty.',
            'any.required': 'Username is required.',
        }),
    firstname: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.min': 'Firstname must contain at least 2 characters.',
            'string.empty': 'Firstname cannot be empty.',
            'any.required': 'Firstname is required.',
        }),
    lastname: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.min': 'Lastname must contain at least 2 characters.',
            'string.empty': 'Lastname cannot be empty.',
            'any.required': 'Lastname is required.',
        }),
})

export const organizerValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Name should be at least 2 characters.',
            'string.max': 'Name should be at max 255 characters.',
            'any.required': 'Name is required.',
        })
})

export const eventValidationSchema = Joi.object({
    eventTypeID: Joi.number()
        .min(0)
        .max(Number.MAX_SAFE_INTEGER)
        .required()
        .messages({
            'number.min': 'eventTypeID must be a non negative integer.',
            'number.max': 'eventTypeID must be an safe integer.',
            'any.required': 'eventTypeID is required.',
        }),
    organizerID: Joi.number()
        .min(0)
        .max(Number.MAX_SAFE_INTEGER)
        .required()
        .messages({
            'number.min': 'organizerID must be a non negative integer.',
            'number.max': 'organizerID must be a safe integer.',
            'any.required': 'organizerID is required.',
        }),
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Name should be at least 2 characters.',
            'string.max': 'Name should be at max 255 characters.',
            'any.required': 'Name is required.',
        }),
    price: Joi.number()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER)
        .required()
        .messages({
            'number.min': 'Price must be a non-zero positive real number',
            'number.max': 'Price must be a safe integer.',
            'any.required': 'Price is required.',
        }),
    dateTime: Joi.number()
        .integer()
        .not(0)
        .positive()
        .custom((value, helpers) => {
            const currentTimestamp = Math.floor(Date.now() / 1000)
            if (value <= currentTimestamp) {
                return helpers.error('any.invalid', {value})
            }
            return value
        }, 'Future dateTime Validation')
        .required()
        .messages({
            'any.invalid': 'dateTime must be in the future',
            'number.base': 'dateTime must be a number',
            'number.integer': 'dateTime must be an integer',
            'number.positive': 'dateTime must be a positive number',
            'any.required': 'dateTime is required',
        }),
    locationLatitude: Joi.number()
        .min(-90)
        .max(90)
        .required()
        .messages({
            'number.base': 'Latitude must be a number',
            'number.min': 'Latitude must be greater than or equal to -90',
            'number.max': 'Latitude must be less than or equal to 90',
            'any.required': 'Latitude is required',
        }),

    locationLongitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
        .messages({
            'number.base': 'Longitude must be a number',
            'number.min': 'Longitude must be greater than or equal to -180',
            'number.max': 'Longitude must be less than or equal to 180',
            'any.required': 'Longitude is required',
        }),
    maxParticipants: Joi.number()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER)
        .required()
        .messages({
            'number.min': 'maxParticipants must be a non-zero positive real number',
            'number.max': 'maxParticipants must be a safe integer.',
            'any.required': 'maxParticipants is required.',
        }),
    numOfParticipants: Joi.number()
        .equal(0)
})

export const reservationValidationSchema = Joi.object({
    eventID: Joi.number()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER)
        .required(),
    userID: Joi.number()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER)
        .required()
})