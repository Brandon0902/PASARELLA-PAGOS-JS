const config = module.exports;
const assert = require('assert');

const {
    CONEKTA_API_KEY,
    CONEKTA_API_URL,
    SEND_GRID_API_KEY,
    SEND_GRID_EMAIL_FROM,
    SUPPORT_EMAIL_CONTACT,
    NODE_ENV,
} = process.env;

const isTestEnv = NODE_ENV === 'test';

const message = required => `Must provide a ${required} variable`;

if (!isTestEnv) {
    assert(CONEKTA_API_KEY, message('CONEKTA_API_KEY'));
    assert(CONEKTA_API_URL, message('CONEKTA_API_URL'));
    assert(SEND_GRID_API_KEY, message('SEND_GRID_API_KEY'));
    assert(SEND_GRID_EMAIL_FROM, message('SEND_GRID_EMAIL_FROM'));
    assert(SUPPORT_EMAIL_CONTACT, message('SUPPORT_EMAIL_CONTACT'));
}

config.properties = {
    CONEKTA_API_KEY: CONEKTA_API_KEY,
    CONEKTA_API_URL: CONEKTA_API_URL,
    SEND_GRID_API_KEY: SEND_GRID_API_KEY,
    SEND_GRID_EMAIL_FROM: SEND_GRID_EMAIL_FROM,
    SUPPORT_EMAIL_CONTACT: SUPPORT_EMAIL_CONTACT,
}