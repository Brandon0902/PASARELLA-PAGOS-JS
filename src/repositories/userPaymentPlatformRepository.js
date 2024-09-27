const { UserPaymentPlatform } = require('../models/plane')

const create = async(entity, transaction) => {
    return await UserPaymentPlatform.create(entity, { transaction });
}

module.exports = {
    create
}