const { SubscriptionType } = require('../models/plane')

const findById = async (id) => {
    return SubscriptionType.findByPk(id)
}

module.exports = {
    findById
}