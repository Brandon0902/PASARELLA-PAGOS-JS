const jwt = require('jsonwebtoken')

const decodeJWT = (token) => {
    return jwt.decode(token)
}

module.exports = {
    decodeJWT
}