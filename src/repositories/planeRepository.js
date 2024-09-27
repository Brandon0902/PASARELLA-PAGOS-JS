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

const findById = async (id) => {
    return await Plane.findByPk(id)
}

module.exports = {
    findAll,
    findById
}