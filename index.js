//initialise dotenv to read values from .env file
require('dotenv').config()

//import discord.js Client and GatewayIntentBits Class
const { Client, GatewayIntentBits, Events } = require('discord.js')

//create a client that allows us to communicate with our discord server
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]})

//respond to the "ready" event -- when the bot is online, the ready event function is triggered/called
client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//respond to a message in the server depending on its content
client.on(Events.MessageCreate, msg => {
    if (msg.content == 'hello') {
        console.log('received?')
        msg.reply('there...')
    }
})

//access token from .env file
client.login(process.env.TOKEN)