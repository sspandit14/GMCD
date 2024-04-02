const { SlashCommandBuilder } = require('discord.js');
var help_text = 'Error, help text didn\'t load properly :(';

const fs = require('fs');
fs.readFile('./gmcd-help.txt', (err, data) => {
    if (err) throw err;

    help_text = data.toString();
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gmcd-help')
        .setDescription('get an overview of GMCD\'s commands and the bot\'s functionality'),
    async execute(interaction) {
        await interaction.reply({content: help_text, ephemeral: true});
    },
};