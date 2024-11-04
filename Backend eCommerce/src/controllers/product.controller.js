'use strict'

const { SuccessResponse } = require("../core/success.response")
const ProductFactory = require("../services/product.service.xxx")

class ProductController {

    createProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //update(patch)
    updateProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Update Product success',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //publish
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product Publish success',
            metadata: await ProductFactory.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //unpublish
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product UnPublish success',
            metadata: await ProductFactory.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductFactory.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Search success',
            metadata: await ProductFactory.searchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list All Products success',
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Product success',
            metadata: await ProductFactory.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController()