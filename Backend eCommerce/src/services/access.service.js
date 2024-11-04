 'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN' 
}

 class AccessService {

    //REFESHTOKEN
    /*
        check this token used
    */
   static handlerRefeshToken = async ( {keyStore, user, refeshToken} ) => {
    //check xem token nay da duoc su dung chua    
    // const foundToken = await KeyTokenService.findByRefeshTokenUsed( refeshToken )
    //     //neu co
    //     if(foundToken) {
    //         //decode xem nay la thang nao
    //         const { userId, email } = await verifyJWT( refeshToken, foundToken.privateKey )
    //         console.log({ userId, email })
    //         //xoa tat ca token trong keyStore
    //         await KeyTokenService.deleteKeyById(userId)
    //         throw new ForbiddenError('Something wrong happend !! Pls relogin')
    //     }

    //     //Neu khong
    //     const holderToken = await KeyTokenService.findByRefeshToken( refeshToken )
    //     if(!holderToken) throw new AuthFailureError('Shop not registered')

    //     //verifyToken
    //     const { userId, email } = await verifyJWT( refeshToken, holderToken.privateKey )
    //     console.log('[2]--', { userId, email })

        const { userId, email } = user;

        if(keyStore.refeshTokensUsed.includes(refeshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! PLs relogin')
        }

        if(keyStore.refeshToken !== refeshToken) throw new AuthFailureError('Shop not regiserted')

        //check UserId
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new AuthFailureError('Shop not registered')

        //create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        //update token

        await holderToken.update({
            $set: {
                refeshToken: tokens.refreshToken
            },
            $addToSet: {
                refeshTokensUsed: refeshToken //da duoc su dung de lay token moi
            }
        })

        return {
            user,
            tokens
        }
   }

    //LOGOUT
    static logout = async ( keyStore ) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }

    //LOGIN
    /*
        1- check email in dbs
        2- match password
        3- create AT vs RT and save
        4- generate tokens
        5- get data return login
    */

    static login = async ({ email, password, refeshToken = null }) => {
        //1.
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new BadRequestError('Shop not registered')

        //2.
        const match = bcrypt.compare( password, foundShop.password )
        if(!match) throw new AuthFailureError('Authentication error')

        //3.
        // created privatedKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4.
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refeshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })


        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }

    }

    //SIGNUP
    static signUp = async ({ name, email, password }) => {
        //try {
            // step1: check email exists??

            const hodelShop = await shopModel.findOne({ email }).lean()

            if(hodelShop) {
                throw new BadRequestError('Error: Shop already registered!')
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // created privateKet, publicKey

                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')


                
                console.log({ privateKey, publicKey })  // save collection KeyStore
                
                // const publicKeyString = await KeyTokenService.createKeyToken({
                //     userId: newShop._id,
                //     publicKey
                // })

                // if(!publicKeyString) {
                //     return {
                //         code: 'xxxx',
                //         message: 'publicKeyString error'
                //     }
                // }

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }

                // console.log(`publicKeyString::`, publicKeyString)
                // const publicKeyObject = crypto.createPublicKey( publicKeyString )
                
                //created token pair
                // const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)
                // console.log(`Created Token Success::`, tokens)

                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
 }

 module.exports = AccessService