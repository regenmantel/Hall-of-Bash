const config = require('../../../Credentials/Config');
const { ApplicationCommandType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'sd',
	type: ApplicationCommandType.ChatInput,
	description: 'Erstelle ein SD Anfrage',
	onlyRoles: [config.server.roles.mod, config.server.roles.sf],
	run: async (client, interaction) => {
		const sdMessage = new EmbedBuilder();
		sdMessage.setTitle('Skrupellos®').setDescription('Benachrichtige die SF das eine neue SD Anfrage im Forum ist.').setColor(0xed3d7d);

		await interaction.reply({
			embeds: [sdMessage],
			components: [new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('sda').setLabel('SD Beantragt').setStyle(ButtonStyle.Secondary).setEmoji('⚔️'))],
		});
	},
};
