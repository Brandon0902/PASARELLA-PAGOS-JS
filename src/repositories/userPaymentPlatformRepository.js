const { UserPaymentPlatform, PaymentPlatform } = require('../models/plane')

const create = async(entity, transaction) => {
    return await UserPaymentPlatform.create(entity, { transaction });
}

const findOne = async(filters) => {
    return await UserPaymentPlatform.findOne({
        include: [PaymentPlatform],
        where: { ...filters } 
    })
}

module.exports = {
    create,
    findOne
}