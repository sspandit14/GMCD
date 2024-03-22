const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('proivdes user information'),
    async execute(interaction) {
        await interaction.reply(`${interaction.user.username}, you joned on ${interaction.member.joinedAt}.`);
    },
};