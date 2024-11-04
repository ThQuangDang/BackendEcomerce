'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad resquest error',
    CONFLICT: 'Conflict error'
}

const myLogger = require('../loggers/mylogger.log')
// const logger = require('../loggers/wiston.log')
const { 
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {

    constructor(message, status) {
        super(message)
        this.status = status
        this.now = Date.now()

        //log the error use winston
        // logger.error(`${this.status} -  ${this.message}`)
        // myLogger.error(this.message, {
        //     context: '/path',
        //     requestId: 'UUUUAAAA',
        //     message: this.message,
        //     metadata: {}
        // })
        // myLogger.error(this.message, ['api/v1/login', 'vv333444', {error: 'Bad request error ...'}])
    }
}

class ConflictRequestError extends ErrorResponse{

    constructor( message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    } 
}

class BadRequestError extends ErrorResponse{

    constructor( message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    } 
}

class AuthFailureError extends ErrorResponse{

    constructor( message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED ) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse{

    constructor( message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND ) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse{

    constructor( message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}