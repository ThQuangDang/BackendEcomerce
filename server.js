'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./sys_message_queue_shopDEV/src/services/consumerQueue.service')
const queueName = 'test-topic'

// consumerToQueue(queueName).then( () => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch( err => {
//     console.error(`Message Error:: ${err.message}`)
// })

consumerToQueueNormal(queueName).then( () => {
    console.log(`Message consumer started ${queueName}`)
}).catch( err => {
    console.error(`Message Error:: ${err.message}`)
})

consumerToQueueFailed(queueName).then( () => {
    console.log(`Message consumer started ${queueName}`)
}).catch( err => {
    console.error(`Message Error:: ${err.message}`)
})