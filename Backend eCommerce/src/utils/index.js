'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectMongodb = id => Types.ObjectId(id)

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick( object, fileds )
}

//['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

//['a', 'b'] => {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k => {
        if(obj[k] && typeof obj[k] === 'object') removeUndefinedObject(obj[k])
        else if (obj[k] == null) delete obj[k]
    })

    return obj
}

/*
    const a = {
        c: {
            d: 1,
            e: 2
        }
    }

    db.collection.updateOne({
        `c.d`: 1,
        `c.e`: 2
    })
*/
const updateNestedObjectParser = obj => {
    console.log(`[1]::`, obj)
    const final = {}
    Object.keys(obj).forEach( k => {
        console(`[3]`, k)
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach( a => {
                console(`[4]`, a)
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
}

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(k => {
        const placeholder = `{{${k}}}` // {{verify_key}}
        template =  template.replace( new RegExp(placeholder, 'g'), params[k] )
    })

    return template
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectMongodb,
    replacePlaceholder
}