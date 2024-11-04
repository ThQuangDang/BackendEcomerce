'use strict'

const { BadRequestError } = require("../core/error.response")
const { product } = require("../models/product.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const { order } = require('../models/order.model')

/*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shopdicount:[],
                item_product:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shopdicount:[
                    {
                        shopId,
                        discountId,
                        codeId
                    }
                ],
                item_product:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
*/

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids =[]
    }){
        //check cartId ton tai khong
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exsist!')

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            freeShip: 0, //phi van chuyen
            totalDiscount: 0, //tong tin discount giam gia
            totalCheckout: 0, // tong thanh toan
        }, shop_order_ids_new = []

        //tinh tong tien bill
        for(let i =0; i< shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            //check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!')

            //tong tin don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //tong tien truoc khi xu ly
            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            //neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length > 0){
                //gia su chi co mot discount
                //get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                //tong cong discount giam gia
                checkout_order.totalDiscount += discount

                //neu tien giam gia lon hon 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    //order

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }){
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        //check lai mot lan nua xem vuot ton kho hay khong
        //get new array Products
        const products = shop_order_ids_new.flatMap( order => order.item_products )
        console.log(`[1]:`, products)
        const acquireProduct = []
        for(let i = 0; i < products.length; i++){
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push( keyLock ? true : false )
            if(keyLock) {
                await releaseLock(keyLock)
            }
        }

        //check if co mot san pham het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError(`Mot so san pham da duoc cap nhap, vui long quay lai gio hang`)
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        //truong hop: new insert thanh cong, thi remove product co trong cart
        if(newOrder){
            //remove product in my cart

        }

        return newOrder

    }

    /*
        1> Query Orders [Users]
    */
    static async getOrdersByUSer() {

    }

    /*
    	 1> Query Order Using Id [Users]
    */
    static async getOneOrderByUser() {

    }

    /*
        1> Cancel Order [Users]
    */
    static async cancelOrderByUser() {
            
    }

    /*
        1> Update Order Status [Shop | Admin]
    */
    static async updateOrderStatusByShop() {
        
    }

}

module.exports = CheckoutService