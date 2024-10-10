const { sendEmail } = require('../utils/email')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const appConfig = require('../config/config')

const renderTemplate = (template, data) => {

    const templatePath = path.join(__dirname, '../resources/templates/', template)
    const readTemplate = fs.readFileSync(templatePath, 'utf-8')
    
    return ejs.render(readTemplate, data)
}

const buildSubscriptionData = async (subscription) => {

    return {
        data: {
            planeName: subscription.planeName,
            renewDate: subscription.renewDate,
            contactEmail: appConfig.properties.SUPPORT_EMAIL_CONTACT
        },
        subject: '¡Ya eres parte de Lexfania! Comienza usar la plataforma hoy mismo',
        textContext: 'Active subscription',
        templateFile: 'subscription_template.ejs'
    }
}

const send = async (subscription) => {

    const { data, subject, text, templateFile } = await buildSubscriptionData(subscription)

    const html = renderTemplate(templateFile, data)

    const user = subscription.user

    const emailData = {
        to: user.email,
        from: appConfig.properties.SEND_GRID_EMAIL_FROM,
        subject: subject,
        text: text,
        html: html
    }

    await sendEmail(emailData)
}

module.exports = {
    send
}