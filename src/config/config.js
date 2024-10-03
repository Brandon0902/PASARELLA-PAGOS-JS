const config = module.exports
const assert = require('assert')

const {
    CONEKTA_API_KEY,
    CONEKTA_API_URL
} = process.env

const message = required => `Must provide a ${required} variable`
assert(CONEKTA_API_KEY, message('CONEKTA_API_KEY'))
assert(CONEKTA_API_URL, message('CONEKTA_API_URL'))

config.properties = {
    CONEKTA_API_KEY: CONEKTA_API_KEY,
    CONEKTA_API_URL: CONEKTA_API_URL
}

