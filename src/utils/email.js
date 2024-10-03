const sgMail = require('@sendgrid/mail')
const { properties } = require('../config/config')

sgMail.setApiKey(properties.SEND_GRID_API_KEY)

const sendEmail = async (message) => {

    const emailData = {
        to: message.to,
        from: message.from,
        subject: message.subject,
        text: message.text,
        html: message.html
    }

    try {
        const response = await sgMail.send(emailData)
        console.log('Response', response[0].statusCode)
        console.log('Response', response[0].headers)
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    sendEmail
}