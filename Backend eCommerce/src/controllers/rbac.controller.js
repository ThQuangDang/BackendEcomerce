'use strict'

const { SuccessResponse } = require("../core/success.response")
const { createRole, createResource, roleList, resourceList } = require("../services/rbac.service")

/**
 * @desc Create new role
 * @param {string} name
 * @param {*} res
 * @param {*} next
 */

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'created role',
        metadata: await createRole( req.body )
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'created resource',
        metadata: await createResource( req.body )
    }).send(res)
}

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: 'get list roles',
        metadata: await roleList( req.query )
    }).send(res)
}

const listResources = async (req, res, next) => {
    new SuccessResponse({
        message: 'get list Resources',
        metadata: await resourceList( req.query )
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    listRoles,
    listResources
}

