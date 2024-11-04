'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

//Search
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

//All Product
router.get('/', asyncHandler(productController.findAllProducts))

//One Product
router.get('/:product_id', asyncHandler(productController.findProduct))

//authentication
router.use(authentication)

//Product
router.post('/', asyncHandler(productController.createProduct))

//Update Product
router.patch('/:productId', asyncHandler(productController.updateProduct))

//Publish: false => true
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))

//UnPublish
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//Query Draft all
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

//Query Publish all
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router