const { Plane, Benefit, SubscriptionType, SubscriptionPrice } = require('../models/plane')

const findAll = async () => {
    const result = await Plane.findAll({
        include: [
            { 
                model: Benefit 
            },
            {
                model: SubscriptionPrice,
                include: [SubscriptionType]
            }
        ]
    })
    return result
}

module.exports = {
    findAll
}