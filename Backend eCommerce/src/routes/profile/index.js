'use strict'

const { profile, profiles } = require('../../controllers/profile.controller')

const express = require('express')
const { grantAccess } = require('../../middlewares/rbac')
const router = express.Router()

router.get('/viewAny', grantAccess('readAny', 'profile'), profiles)
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profile)

module.exports = router