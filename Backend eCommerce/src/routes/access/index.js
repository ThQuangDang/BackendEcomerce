'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// signUP
router.post('/shop/signup', asyncHandler(accessController.signUp))

//Login
router.post('/shop/login', asyncHandler(accessController.login))

//authentication
router.use(authentication)

//logout
router.post('/shop/logout', asyncHandler(accessController.logout))

//HandlerRefreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router