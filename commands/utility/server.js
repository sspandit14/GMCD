const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('provide server information'),
    async execute(interaction) {
        await interaction.reply(`welcome to ${interaction.guild.name}, we have ${interaction.guild.memberCount} people here!`);
    },
};