const config = module.exports
const assert = require('assert')

const {
    CONEKTA_API_KEY,
    CONEKTA_API_URL,
    SEND_GRID_API_KEY,
    SEND_GRID_EMAIL_FROM,
    SUPPORT_EMAIL_CONTACT,
    WEBHOOK_API_KEY,
} = process.env

const message = required => `Must provide a ${required} variable`
assert(CONEKTA_API_KEY, message('CONEKTA_API_KEY'))
assert(CONEKTA_API_URL, message('CONEKTA_API_URL'))
assert(SEND_GRID_API_KEY, message('SEND_GRID_API_KEY'))
assert(SEND_GRID_EMAIL_FROM, message('SEND_GRID_EMAIL_FROM'))
assert(SUPPORT_EMAIL_CONTACT, message('SUPPORT_EMAIL_CONTACT'))
assert(WEBHOOK_API_KEY, message('WEBHOOK_API_KEY'))

config.properties = {
    CONEKTA_API_KEY: CONEKTA_API_KEY,
    CONEKTA_API_URL: CONEKTA_API_URL,
    SEND_GRID_API_KEY: SEND_GRID_API_KEY,
    SEND_GRID_EMAIL_FROM: SEND_GRID_EMAIL_FROM,
    SUPPORT_EMAIL_CONTACT: SUPPORT_EMAIL_CONTACT,
    WEBHOOK_API_KEY: WEBHOOK_API_KEY,
}

