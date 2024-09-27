const { SubscriptionPrice } = require('../models/plane')

const findByPlaneAndSubscriptionType = async (planeId, subscriptionTypeId) => {
    return await SubscriptionPrice.findOne(
        {
            where: { planeId, subscriptionTypeId }
        }
    )
}

module.exports = {
    findByPlaneAndSubscriptionType
}