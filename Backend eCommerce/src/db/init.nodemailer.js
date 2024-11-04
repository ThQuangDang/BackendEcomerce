'use strict'

const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AWS_EMAIL_USERID,
        pass: process.env.AWS_EMAIL_PASS
    }
})

module.exports = transport