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

class BadRequestError extends Error {
    constructor(message, details = []) {
        super(message)
        this.status = 400
        this.details = details
    }
}

const errorHandler = (err, req, res, next) => {
    console.log('enter error', err);

    if (err.details && Array.isArray(err.details)) {
        return res.status(422).json({
            message: err.details[0]?.message || 'Error de validación en Conekta',
            details: err.details
        });
    }

    if (err.status) {
        return res.status(err.status).json({
            message: err.message,
            details: err.details || []
        });
    }

    res.status(500).json({
        message: err.message || 'An error occurred',
        details: []
    });
}

module.exports = {
    errorHandler,
    NotFoundError,
    InternalServerError,
    BadRequestError
}