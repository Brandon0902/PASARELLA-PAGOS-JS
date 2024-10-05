const { decodeJWT } = require('../utils/decode')
const appConfig = require('../config/config')
const Schema = require('../validations/schemas')

const getUserData = (token) => {
    const payload = decodeJWT(token)
    if (payload) {
        return {
            id: payload.id,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone
        }
    }
}

const isValid = (data) => {
    const result = Schema.userAuth.validate(data)

    return result.error === undefined
}

const checkAuthToken = (req, res, next) => {
    const token = req.get('Authorization')

    if (!token) {
        return res.status(401).send({error: 'unauthorized error'})
    }

    const user = getUserData(token)
    if (!isValid(user)) {
        return res.status(400).send({error: 'user bad request'})
    }

    req.user = user

    return next();
}

const checkApiKey = (req, res, next) => {
    const apiKey = req.query.apiKey

    if (apiKey !== appConfig.properties.WEBHOOK_API_KEY) {
        return res.status(401).send({error: 'unauthorized error'})
    }

    return next()
}

module.exports = {
    checkAuthToken,
    checkApiKey
}