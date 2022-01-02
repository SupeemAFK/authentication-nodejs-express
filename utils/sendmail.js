const sgMail = require('@sendgrid/mail');
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendmail(options) {
    const { to, subject, text, html } = options;
    const msg = {
        to: to,
        from: 'kuypeem0@gmail.com', // Use the email address or domain you verified above
        subject: subject,
        text: text,
        html: html,
    };

    try {
        await sgMail.send(msg);

    } catch (error) {
        console.error(error)
    }
}

module.exports = sendmail;