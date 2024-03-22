//load the required classes and data from discord.js and config.json
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//create a new client instance and provide it the Guilds (servers) Intents (permissions); client is the means by which to interact with the Discord API
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//when the client is ready and online a message is logged to the console
client.on('ready', () => {
    console.log(`${client.user.tag}, at your service!`);
})

//login using the bot token
client.login(token);