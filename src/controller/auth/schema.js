import Joi from '@hapi/joi';

export const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    fullName: Joi.string().min(3).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});