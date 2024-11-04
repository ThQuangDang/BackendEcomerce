const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const { v4: uuidv4  } = require('uuid');
const myLogger = require('./loggers/mylogger.log');

//cors
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: 'true',
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//log
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`input params ::${req.method}::`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.body
    ])

    next()
})

//init db
require('./db/init.mongodb')

// const { checkOverload } = require('./helper/check.connect')
// checkOverload()


//init routes
app.use('/', require('./routes'))

//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
    myLogger.error(resMessage, [
        req.path,
        {requestId: req.requestId},
        {
            message: error.message
        }
    ])
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;