// load the required classes and data from discord.js and config.json and slash command requirements
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// create a new client instance and provide it the Guilds (servers) Intents (permissions); client is the means by which to interact with the Discord API
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// add a commands collection to the client so that we can acess commands written in other files efficiently (Collection is like an extended Map)
client.commands = new Collection();

// dynamically retrieve the command files
// navigate to the commands folder, navigates to the utility folder, returns all files in utility ending with '.js',
// go through each of those files and create a new item in client's command collection with the command name as the key
// and the exported module as the value if at least the data and execute properties exist (prevent errors later on)
const folder_path_ = path.join(__dirname, 'commands');
const command_folders_ = fs.readdirSync(folder_path_);

for (const folder of command_folders_) {
    const command_path_ = path.join(folder_path_, folder);
    const command_files_ = fs.readdirSync(command_path_).filter(file => file.endsWith('.js'));

    for (const file of command_files_) {
        const file_path_ = path.join(command_path_, file);
        const command = require(file_path_);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// when the client is ready and online a message is logged to the console
client.on('ready', () => {
    console.log(`${client.user.tag}, at your service!`);
})

// create a listener for interaction events but do nothing if not a slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) { return; }

    // check if the command exists, if it does execute it (log an error if it fails), else output error to console and return
    const slash_comm_ = interaction.client.commands.get(interaction.commandName);

    if (!slash_comm_) { console.error(`${interaction.commandName} is not a valid command`); return;}
    
    try {
        await slash_comm_.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: `Error while executing command`, ephemeral: true});
        } else {
            await interaction.reply({ content: `Error while executing the command`, ephemeral: true});
        }
    }
});

// login using the bot token
client.login(token);