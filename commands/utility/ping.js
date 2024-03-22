const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pongs back'),
    async execute(interaction) {
        await interaction.reply('pong!');
    },
};