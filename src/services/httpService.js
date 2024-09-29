const { default: axios } = require("axios");
const { properties } = require('../config/config')

const conektaClient = axios.create({
    baseURL: properties.CONEKTA_API_URL,
    headers: {
        accept: 'application/vnd.conekta-v2.1.0+json',
        'Accept-Language': 'es',
        'Authorization': `Bearer ${properties.CONEKTA_API_KEY}`
    }
})

module.exports = { conektaClient }