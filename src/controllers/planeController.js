const planeService = require('../services/planeService')
const Schemas = require('../validations/schemas')
const { BadRequestError } = require('../handlers/errors')

const getAll = async (req, res, next) => {
    try {
        const planes = await planeService.getAll();
        return res.json(planes);
    } catch (err) {
        next(err);
    }
}

const isValid = (data) => {

    const result = Schemas.plane.validate(data)

    if (result.error) {
        throw new BadRequestError(result.error.message)
    }

    return true;
}

const toPlanePaymentPlatform = (data) => {
    return {
        planeId: data.plane_id,
        subscriptionTypeId: data.subscription_type_id,
        paymentPlatformId: data.payment_platform_id,
        referenceId: data.reference_id
    }
}

const createPaymentPlatform = async (req, res, next) => {

    try {
        const request = req.body

        if (isValid(request)) {
            const data = toPlanePaymentPlatform(request)
            return await res.json(await planeService.createPaymentPlatform(data))
        }
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getAll,
    createPaymentPlatform
}