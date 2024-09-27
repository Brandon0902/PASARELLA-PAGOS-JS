const subscriptionSchema = require('../validations/schemas')
const SubscriptionService = require('../services/subscriptionService')

const isValid = (data) => {
    const result = subscriptionSchema.subscription.validate(data);
    
    if(result.error)
        throw new Error(result.error.message)
    
    return result.error === undefined;
}

const create = async (req, res, next) => {
    const subscriptionRequest = req.body
    
    try {
        if(isValid(subscriptionRequest)) {
            const user = req.user
            return res.status(200).send(await SubscriptionService.create({user, subscriptionRequest}))
        } else {
            res.status(400).send({error: 'bad request'})
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    create
}