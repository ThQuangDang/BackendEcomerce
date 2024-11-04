'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000


const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`NUmber of connections: ${numConnection}`)
}

//check over load
const checkOverload = () => {
    setInterval( () => {
        const numConnection = mongoose.connection.length
        const numCores = os.cpus.length
        const memotyUsage = process.memoryUsage().rss

        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage: ${memotyUsage / 1024 / 1024} MB`)

        if(numConnection > maxConnections) {
            console.log(`Connection overload detected!`)
            //notify.send(...)
        }

    }, _SECONDS )
}

module.exports = {
    countConnect,
    checkOverload
}