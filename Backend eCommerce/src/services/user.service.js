'use strict'

const USER = require('../models/user.model')
const { BadRequestError } = require('../core/error.response')
const { sendEmailToken } = require('./email.service')

const newUser = async ({
    email,
    captcha
}) => {
    //1. check email exists in dbs - thường thì các hệ thống lớn sẽ sử dụng redis
    const user = await USER.findOne({ email }).lean()

    //2. if exists
    if(user) throw new BadRequestError('Email already exists')

    //3. send tokens via email user
    const result = await sendEmailToken({
        email
    })

    return {
        message: 'verify email user',
        metadata: {
            token: result
        }
    }
}