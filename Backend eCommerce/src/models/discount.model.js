'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // percentage
    discount_value: { type: Number, required: true }, //10.000 , 10
    discount_code: { type: String, required: true }, // discountCode
    discount_start_date: { type: Date, required: true }, //ngay bat dau
    discount_end_date: { type: Date, required: true }, //ngay ket thuc
    discount_max_uses: { type: Number, required: true }, //So luong discount duoc ap dung
    discount_uses_count: { type: Number, required: true }, //So discount da su dung
    discount_users_used: { type: Array, default: [] }, // ai da su dung
    discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep toi da nguoi dung su dung 
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }, // So san pham duoc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema)