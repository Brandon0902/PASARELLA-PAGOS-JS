const SubscriptionTypeRespository = require('../repositories/subscriptionTypeRepository')
const { NotFoundError } = require('../handlers/errors')

const getById = async (id) => {
    const result = await SubscriptionTypeRespository.findById(id)

    if(result === null)
        throw new NotFoundError(`subscription type '${id}' not found`)

    return result
}

module.exports = {
    getById
}