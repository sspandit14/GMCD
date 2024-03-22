const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// get all the commands in our commands folder and put it into the commands list (same process as in index.js)

const folder_path_ = path.join(__dirname, 'commands');
const command_folders_ = fs.readdirSync(folder_path_);

for (const folder of command_folders_) {
    const command_path_ = path.join(folder_path_, folder);
    const command_files_ = fs.readdirSync(command_path_).filter(file => file.endsWith('.js'));

    for (const file of command_files_) {
        const file_path_ = path.join(command_path_, file);
        const command = require(file_path_);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// create a REST module object
const rest = new REST().setToken(token);

// deploy the commands (new commands or updating existing commands)
(async () => {
    try {
        console.log(`beginning to refresh ${commands.length} slash commands`);

        // use the put method to refresh all slash commands in the server
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`refresh of ${data.length} slash commands completed!`);
    } catch (error) {
        console.error(error);
    }
})();