'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic } = require("../models/product.model")
const { insertInventory } = require("../models/repositories/inventory.repo")
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require("../models/repositories/product.repo")
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils/index")
const { pushNotiToSystem } = require("./notification.service")

class ProductFactory {
    
    static productRegistry = {} //key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct( type, payload ){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct( type, productId, payload ){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    //Put

    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }

    //query 

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProduct ({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true} }) {
        return await findAllProducts({ limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}

class Product {

    constructor({ product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }

    async createProduct( product_id ) {
        const newProduct =  await product.create({...this, _id: product_id})
        if(newProduct) {
            const invenData = await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
            //push noti system collection
            pushNotiToSystem({
                type: 'SHOP-001',
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shope_name: this.product_shop
                }
            }).then(rs => console.log(rs))
            .catch(console.error)
            console.log('invenData::', invenData)
        }

        return newProduct
    }

    async updateProduct(  productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

class Clothing extends Product{

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }

    async updateProduct( productId ) {
        /*
            {
                a: undefined,
                b: null
            }
        */
        //1. remove attribute has null or undefined
        console.log(`[1]::`, this)
        const objectParams = removeUndefinedObject(this)
        console.log(`[2]::`, objectParams)
        //2. check xem update o cho nao?
        if(objectParams.product_attributes) {
            //update child
            await updateProductById({ 
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing 
            })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Electronics extends Product{

    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

//register product types
ProductFactory.registerProductType('Electronics',Electronics)
ProductFactory.registerProductType('Clothing', Clothing)

module.exports = ProductFactory