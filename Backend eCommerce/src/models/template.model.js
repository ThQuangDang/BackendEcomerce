'use strict'

const { Schema, model } = require("mongoose")


const DOCUMENT_NAME = 'template'
const COLLECTION_NAME = 'templates'

const templateSchema = new Schema({
    tem_id: { type: Number, required: true },
    tem_name: { type: String, required: true },
    tem_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
    tem_html: { type: String, required: true }
}, {
    timestamps,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, templateSchema)