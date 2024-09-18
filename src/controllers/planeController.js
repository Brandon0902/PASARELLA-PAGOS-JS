const planeService = require('../services/planeService')


const getAll = async (req, res, next) => {
    return await res.json(await planeService.getAll())
}

module.exports = {
    getAll
}