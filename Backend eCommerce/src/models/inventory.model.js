'use strict'

const { Schema, model } = require("mongoose")


const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
    iven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    iven_location: { type: String, default: 'unKnow' },
    iven_stock: { type: Number, required: true },
    iven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    iven_reservation: { type: Array, default: [] }
    /*
        cartId:
        stock: 1,
        createdOn:
    */
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}