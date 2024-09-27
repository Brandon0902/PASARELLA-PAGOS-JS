const repository = require('../repositories/planeRepository');

const getAll = async () =>  {
    return await repository.findAll()
}

const getById = async (id) => {
    const result = await repository.findById(id);
    
    if(result === null)
        throw new Error('plane not exists')
    
    return result
}

module.exports = {
    getAll,
    getById
}