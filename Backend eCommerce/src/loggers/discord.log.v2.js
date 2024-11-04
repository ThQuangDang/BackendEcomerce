'use strict'

const { Client, GatewayIntentBits } = require('discord.js')


class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        //add channelId
        this.channelId = process.env.CHANNELID_DISCORD

        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}!`)
        })
        this.client.login(process.env.TOKEN_DISCORD)

    }

    sendToFormatCode(logData){
        const { code, message = 'This is some additional information about the code.', title = 'Code Example' } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16), //Convert hexadecimal color code to integer
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        }
        this.sendToFormatCode(codeMessage)
    }

    sendToMessage( message = 'message'){
        const channel = this.client.channels.cache.get(this.channelId)
        if(!channel){
            console.error(`Counldn't fin the channel...`, this.channelId)
            return
        }
        // message use CHAT GPT API CALL
        channel.send(message).catch(e => console.error(e))
    }

}

module.exports = new LoggerService();