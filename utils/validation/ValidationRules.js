import Joi from 'joi';

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
});

