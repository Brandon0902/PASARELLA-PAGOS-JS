const { Subscription } = require('../models/plane')

const create = async (entity, transaction) => {
    return await Subscription.create(entity, {transaction})
}

const findByUserId = async (userId) => {
    return await Subscription.findOne({where: {userId: userId}})
}

const findByIdAndUserId = async (id, userId) => {
    return await Subscription.findOne({
        where: { id: id, userId: userId, state: 'ACTIVE'}
    })
}

const findOne = async (filters) => {
    return await Subscription.findOne({
        where: { ...filters }
    })
}

const update = async(id, data, tx) => {
    return await Subscription.update(data, {where: { id: id }, transaction: tx, returning: true})
}

module.exports = {
    create,
    findByUserId,
    findByIdAndUserId,
    update,
    findOne
}