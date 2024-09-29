const errorHandler = (err, req, res, next) => {
    console.log('enter error')
    res.status(err.status || 500).json({
        message: err.message || 'An error ocurred'
    })
}

class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.status = 404
    }
}

class InternalServerError extends Error {
    constructor(message) {
        super(message)
        this.status = 500
    }
}

module.exports = {
    errorHandler,
    NotFoundError,
    InternalServerError
}