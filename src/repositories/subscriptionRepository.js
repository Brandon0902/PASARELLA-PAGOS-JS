const { Subscription } = require('../models/plane')

const create = async (entity, transaction) => {
    return await Subscription.create(entity, {transaction})
}

const findByUserId = async (userId) => {
    return await Subscription.findOne({where: {userId: userId}})
}

module.exports = {
    create,
    findByUserId
}