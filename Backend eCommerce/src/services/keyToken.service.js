'use strict'

const { Types } = require('mongoose')
const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refeshToken }) => {
        try {
            // const publicKeyString = publicKey.toString();
            // console.log(`publicKeyString::`, publicKeyString)

            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey, //: publicKeyString
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // level xxx
            const filter = { user: userId }, update = {
                publicKey, privateKey, refeshTokensUsed: [], refeshToken
            }, options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keytokenModel.findOne({ user: Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.remove(id)
    }

    static findByRefeshTokenUsed = async (refeshToken) => {
        return await keytokenModel.findOne({ refeshTokensUsed: refeshToken }).lean()
    }

    static findByRefeshToken = async (refeshToken) => {
        return await keytokenModel.findOne({  refeshToken })
    }

    static deleteKeyById = async ( userId ) => {
        return await keytokenModel.deleteOne({ user: Types.ObjectId(userId) })
    }
}

module.exports = KeyTokenService