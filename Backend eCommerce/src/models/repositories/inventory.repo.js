'use strict'

const { convertToObjectMongodb } = require("../../utils")
const { inventory } = require("../inventory.model")

const insertInventory = async({ productId, shopId, stock, location = 'unKnow' }) => {
    return await inventory.create({
        iven_productId: productId,
        iven_stock: stock,
        iven_shopId: shopId,
        iven_location: location
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        iven_productId: convertToObjectMongodb(productId),
        iven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            iven_stock: -quantity
        },
        $push: {
            iven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}