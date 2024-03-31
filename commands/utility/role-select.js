const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, SlashCommandBuilder, IntegrationApplication } = require('discord.js');

const data = new SlashCommandBuilder()
            .setName('role-select')
            .setDescription('view and select desired roles!');

async function execute(interaction) {
    const selectable_roles = [
        {
            label: 'Member',
            description: 'low commitment and interested in general information!',
            value: '1167579498317889706',
            emoji: '🔵'
        },
        {
            label: 'Events',
            description: 'interested in the events that DataSC will be hosting!',
            value: '1202512593512570921',
            emoji: '🟢'
        },
        {
            label: 'Competing',
            description: 'interested in the competitive team!',
            value: '1202512641591877642',
            emoji: '🟠'
        },
        {
            label: 'They',
            description: ' ',
            value: '1209141070290751528',
            emoji: '🇹'
        },
        {
            label: 'He',
            description: ' ',
            value: '1209140995883794472',
            emoji: '🇭'
        },
        {
            label: 'She',
            description: ' ',
            value: '1209141045259014144',
            emoji: '🇸'
        }
    ];

    const selectRoleMenu = new StringSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setPlaceholder('choose or remove your role(s)!')
        .setMinValues(0)
        .setMaxValues(selectable_roles.length)
        .addOptions(
            selectable_roles.map((role) =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(role.label)
                    .setDescription(role.description)
                    .setValue(role.value)
                    .setEmoji(role.emoji)
            )
        );

    const action_row = new ActionRowBuilder().addComponents(selectRoleMenu);

    const reply = await interaction.reply({ components: [action_row], ephemeral: true });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
        time: 60_000,
    });

    collector.on('collect', async (interaction) => {
        if (!interaction.values.length) {
            interaction.reply({ content:'Nothing selected?', ephemeral:true});
            return;
        }

        const added_roles = [];
        const removed_roles = [];

        for (const role_id of interaction.values) {
            try {
                if (interaction.member.roles.cache.some(r => r.id === role_id)) {
                    await interaction.member.roles.remove(role_id);
                    console.log('role removed!');
                    const role = interaction.guild.roles.cache.get(role_id);
                    removed_roles.push(role.name);
                } else {
                    await interaction.member.roles.add(role_id);
                    console.log('role added!');
                    const role = interaction.guild.roles.cache.get(role_id);
                    added_roles.push(role.name);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if ((!added_roles.length) && (!removed_roles.length)) {
            interaction.reply({ content:'no roles added nor removed', ephemeral: true});
        } else {
            if (added_roles.length && !removed_roles.length) {
                interaction.reply({ content:`The following roles have been added: ${added_roles.join(', ')}`, ephemeral: true});
            }
            else if (removed_roles.length && !added_roles.length) {
                interaction.reply({ content:`The following roles have been removed: ${removed_roles.join(', ')}`, ephemeral: true});
            }
            else {
                interaction.reply({ content:`The following roles have been added: ${added_roles.join(', ')}\nThe following roles have been removed: ${removed_roles.join(', ')}`, ephemeral: true });
            }
        }
    });

}

module.exports = { data, execute }