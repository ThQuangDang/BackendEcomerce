'use strict'

const { Schema, model } = require("mongoose")
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },// quần jean cao cấp
    product_thumb: { type:String, required: true },
    product_description: String,
    product_slug: String, // quan-jean-cao-cap
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.345666 => 4.3
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPulished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true 
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

//Document middleware: runs before .save() and create() ...
productSchema.pre('save', function( next ){
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

//define the product product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'clothes',
    timestamps: true
})

//define the product product type = electronic

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'electronics',
    timestamps: true
})

module.exports = {
    product: model( DOCUMENT_NAME, productSchema ),
    electronic: model( 'Electronics', electronicSchema ),
    clothing: model( 'Clothing', clothingSchema )
}