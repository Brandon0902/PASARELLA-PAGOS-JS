const { UserPaymentPlatform, PaymentPlatform } = require('../models/plane')

const create = async(entity, transaction) => {
    return await UserPaymentPlatform.create(entity, { transaction });
}

const findOne = async({ userId, paymentPlatformId }) => {
    return await UserPaymentPlatform.findOne({
        include: [PaymentPlatform],
        where: { userId, paymentPlatformId } 
    })
}

module.exports = {
    create,
    findOne
}