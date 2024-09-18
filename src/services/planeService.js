const repository = require('../repositories/planeRepository');

const getAll = async () =>  {
    return await repository.findAll()
}

module.exports = {
    getAll
}