const subscriptionSchema = require('../validations/schemas')
const SubscriptionService = require('../services/subscriptionService')
const { BadRequestError } = require('../handlers/errors')

const isValid = (data) => {
    const result = subscriptionSchema.subscription.validate(data);
    
    if(result.error)
        throw new BadRequestError(result.error.message)
    
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

const cancel = async (req, res, next) => {
    try {
        const user = req.user
        const id = parseInt(req.params.id)
        const result = await SubscriptionService.cancel({id, user})
        if(result)
            return res.status(200).send(result)
    } catch(err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    create,
    cancel
}