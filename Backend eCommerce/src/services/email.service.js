'use strict'

const { NotFoundError } = require("../core/error.response")
const transport = require("../db/init.nodemailer")
const { replacePlaceholder } = require("../utils")
const { newOtp } = require("./otp.service")
const { getTemplate } = require("./template.service")

const sendEmailLinkVerify = async({
    html,
    toEmail,
    subject,
    text
}) => {
    try {
        const mailOptions = {
            from: ' "SHOPDEV" <anonystick@gmail.com> ',
            to: toEmail,
            subject,
            text,
            html
        }

        transport.sendMail( mailOptions, (err, info) => {
            if(err){
                return console.log(err)
            }        

            console.log('Message sent :::', info.messageId)
        })
    } catch (error) {
        console.error(`error send Email::`, error)
        return error
    }
}

const sendEmailToken = async({
    email
}) => {
    try {
        //1. get Token
        const token = await newOtp({ email })
        //2. get Template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN'
        })

        if(!template) {
            throw new NotFoundError('Template not found')
        }

        //3. replace placeholder with params
        const content = replacePlaceholder(
            template.tem_html,
            {
                link_verify: `http://localhost:3056/cgp/welcome-back?token=${token.otp_token}`
            }
        )

        //4. send email
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ Email đăng kí ShopDEV.com'
        }).catch( err => console.error(err) )

        return 1

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmailToken
}