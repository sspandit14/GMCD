// code adapted from https://www.youtube.com/watch?v=MDdt35tXYEA

const { RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('show-roles')
    .setDescription('show and select server roles');

async function execute(interaction) {
    const role_menu = new RoleSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setMinValues(0)
        .setMaxValues(20);

    const action_row = new ActionRowBuilder().setComponents(role_menu);

    const reply = await interaction.reply({ components: [action_row] });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.RoleSelect,
        filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
        time: 60_00,
    });

    collector.on('collect', async (interaction) => {
        if (!interaction.values.length) {
            interaction.reply('No roles selected');
            return;
        }

        const added_roles = [];

        for (const role_id of interaction.values) {
            try {
                await interaction.member.roles.add(role_id);
                console.log('role added!')
                const role = interaction.guild.roles.cache.get(role_id);
                added_roles.push(role.name);

            } catch (error) {
                console.error(error);
            }
        }

        interaction.reply(
            `You have selected the following roles: ${added_roles.join(', ')}`
        )
    });
}

module.exports = { data, execute };