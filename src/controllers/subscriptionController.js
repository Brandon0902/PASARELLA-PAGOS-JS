const subscriptionSchema = require('../validations/schemas')
const SubscriptionService = require('../services/subscriptionService')
const { BadRequestError } = require('../handlers/errors')

const isValid = (data) => {
    const result = subscriptionSchema.subscription.validate(data);
    if (result.error) {
        throw new BadRequestError(result.error.message);
    }
    return true;
};

const create = async (req, res, next) => {
    const subscriptionRequest = req.body;

    try {
        isValid(subscriptionRequest);
        const user = req.user;
        const result = await SubscriptionService.create({ user, subscriptionRequest });
        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        if (err instanceof BadRequestError) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        next(err);
    }
};

const cancel = async (req, res, next) => {
    try {
        const user = req.user
        const id = parseInt(req.params.id)
        const result = await SubscriptionService.cancel({id, user})
        if (result) {
            return res.status(200).send(result)
        }
    } catch(err) {
        console.log(err)
        next(err)
    }
}

const getActiveSubscription = async (req, res, next) => {
    try {
        const user = req.user;
        const subscription = await SubscriptionService.getActiveSubscription(user.id);
        return res.status(200).send(subscription);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    create,
    cancel,
    getActiveSubscription,
}