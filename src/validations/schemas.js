const Joi = require("joi");

const subscription = Joi.object({
    plane_id: Joi.number().required(),
    subscription_type_id: Joi.number().required(),
    token_id: Joi.string().required()
});

const userAuth = Joi.object({
    id: Joi.number().required(),
    email: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required()
});

module.exports = {
    subscription,
    userAuth
}