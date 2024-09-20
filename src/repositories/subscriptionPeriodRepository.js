const { SubscriptionPeriod } = require('../models/plane')

const create = async (entity, transaction) => {
    return await SubscriptionPeriod.create(entity, {transaction})
}

module.exports = {
    create
}