'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        if(!connection) throw new Error('Connection not established')

        const channel = await connection.createChannel()

        return { channel, connection }
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ()

        //publish message to a queue
        const queue = 'test-queue'
        const message = 'Hello, shopDEV by anonystick'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        //close the connection
        await connection.close()
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {
            durable: true
        })
        console.log(`Waitting for messages...`)

        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}::`, msg.content.toString())
            //1. find User folowing for SHOP
            //2. Send message to user
            //3. yes, ok  ==> success
            //4. error, setup DLX
        }, {
            noAck: true
        })
    } catch (error) {
        console.error('Error publish message to RabbitMQ', error)
        throw Error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}