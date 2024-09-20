const Joi = require("joi");

const subscription = Joi.object({
    plane_id: Joi.number().required(),
    subscription_type_id: Joi.number().required(),
    token_id: Joi.string().required()
});

module.exports = {
    subscription
}