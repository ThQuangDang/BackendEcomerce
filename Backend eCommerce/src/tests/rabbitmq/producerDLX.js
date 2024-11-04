const amqp = require('amqplib')
const messages = 'new a product: Title abcassd'

const log = console.log

console.log = function() {
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // notificationEx direct
        const notiQueue = 'notificationQueueProcess' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notificationEx direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

        //1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        //2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        //3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        //4. send message
        const msg = 'a new product'
        console.log(`producer msg::`, msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(`error::`, error)
    }

}

runProducer().then(rs => console.log(rs)).catch(console.error)