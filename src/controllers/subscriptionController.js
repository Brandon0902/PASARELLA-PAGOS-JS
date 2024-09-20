const subscriptionSchema = require('../validations/schemas')
const { decodeJWT } = require('../utils/decode')
const SubscriptionService = require('../services/subscriptionService')

const isValid = (data) => {
    const result = subscriptionSchema.subscription.validate(data);
    
    if(result.error)
        throw new Error(result.error.message)
    
    return result.error === undefined;
}

const getUserData = (token) => {
    const payload = decodeJWT(token)
    console.log('payload: ', payload)
    if(payload) {
        return {
            userId: payload.user_id,
            email: payload.email,
            name: payload.name,
            phone: payload.phone
        }
    }
}

const create = async (req, res, next) => {
    const subscriptionRequest = req.body
    const token = req.get('Authorization')
    try {
        if(isValid(subscriptionRequest)) {
            const user = getUserData(token)
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