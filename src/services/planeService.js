const repository = require('../repositories/planeRepository');
const { PlanePaymentPlatform, PaymentPlatform } = require('../models/plane')
const SubscriptionTypeService = require('../services/subscriptionTypeService')
const { NotFoundError } = require('../handlers/errors')
const moment = require('moment')

const getAll = async () =>  {
    return await repository.findAll()
}

const getById = async (id) => {
    const result = await repository.findById(id);
    
    if (result === null) {
        throw new NotFoundError(`plane not '${id}' found`)
    }
    
    return result
}

const validateSubscriptionType = async (id) => {
    return await SubscriptionTypeService.getById(id)
}

const validatePaymentPlatform = async (id) => {

    const result = await PaymentPlatform.findByPk(id)

    if (result === null) {
        throw new NotFoundError(`payment platform '${id}' not found`)
    }
}

const createPaymentPlatform = async (data) => {

    await getById(data.planeId)
    await validateSubscriptionType(data.subscriptionTypeId)
    await validatePaymentPlatform(data.paymentPlatformId)

    data.state = 'ACTIVE'
    data.createdAt = moment().utc()

    return await PlanePaymentPlatform.create(data)
}

module.exports = {
    getAll,
    getById,
    createPaymentPlatform
}