'use strict'

const { inventory } = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '134, Tran Phu, HCM city'
    }){
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('The product does not exists!')

        const query = { iven_shopId: shopId, iven_productId: productId },
        updateSet = {
            $inc: {
                iven_stock: stock
            },
            $set: {
                iven_location: location
            }
        }, options = {upsert: true, new: true}

        return await inventory.findOneAndUpdate( query, updateSet, options)
    }
}

module.exports = InventoryService