const SubscriptionTypeRespository = require('../repositories/subscriptionTypeRepository')

const getById = async (id) => {
    const result = await SubscriptionTypeRespository.findById(id)

    if(result === null)
        throw new Error('subscription type not exists')

    return result
}

module.exports = {
    getById
}