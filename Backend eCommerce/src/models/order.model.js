'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalApllyDiscount,
            freeShip
        }
    */
   order_shipping: { type: Object, default: {} },
   /*
        street,
        city,
        state,
        country
   */
  order_payment: { type: Object, default: {} },
  order_products: { type: Array, required: true },
  order_trackingNumber: { type: String, default: '#00001180052022' },
  order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
   /*
        pending: Đơn hàng đã được tạo nhưng chưa được xử lý
        confirmed: Đơn hàng đã được xử lý và xác nhận bới người bán
        shipped: Đơn hàng đã được vẫn chuyển và đang đến tay người dùng
        cancelled: Đơn hàng đã bị hủy bới khách hàng hoặc người bán
        delivered: Đơn hàng đã được giao đến khách hàng
        --Đã vận chuyển thì không được hủy đơn hàng
   */
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}