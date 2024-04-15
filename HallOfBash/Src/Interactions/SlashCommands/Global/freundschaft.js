const config = require('../../../Credentials/Config');

const { ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'freundschaft',
	description: 'Freundschafts Skill in % angeben',
	onlyRoles: [config.server2.roles.sf, config.server2.roles.mod],
	run: async (client, interaction) => {
		const modal = new ModalBuilder().setCustomId('freundschaft').setTitle(`Freundschaft in % eingeben`);

		const freundschaft = new TextInputBuilder().setCustomId('freundschaft').setLabel('Freundschaft in %').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(50).setPlaceholder('z.B: 20').setRequired(true);

		const freundschaftRow = new ActionRowBuilder().addComponents(freundschaft);

		modal.addComponents(freundschaftRow);
		await interaction.showModal(modal);
	},
};
