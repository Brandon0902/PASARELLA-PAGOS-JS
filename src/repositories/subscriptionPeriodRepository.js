const { SubscriptionPeriod } = require('../models/plane')

const create = async (entity, transaction) => {
    return await SubscriptionPeriod.create(entity, {transaction})
}

const update = async (id, entity, tx) => {
    return await SubscriptionPeriod.update(entity, {where: {id: id}, transaction: tx})
}

const findOne = async (data) => {
    return await SubscriptionPeriod.findOne({where: { ...data }})
}

module.exports = {
    create,
    update,
    findOne
}