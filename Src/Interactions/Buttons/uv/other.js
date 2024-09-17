const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../../Credentials/Config");

module.exports = {
	name: "other",
	run: async (client, interaction) => {
		if (interaction.isButton()) {
			const modal = new ModalBuilder()
				.setCustomId("uvModal")
				.setTitle("Bitte fülle folgende Felder aus:");

			const accountField = new TextInputBuilder()
				.setCustomId("accountName")
				.setLabel("Accountname")
				.setPlaceholder("z.B: regenmantel")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const uvChoice = new TextInputBuilder()
				.setCustomId("uvChoice")
				.setLabel("UV Art")
				.setValue("")
				.setPlaceholder("z.B: andere Gründe für UV")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const time = new TextInputBuilder()
				.setCustomId("time")
				.setLabel("Zeitraum")
				.setPlaceholder("z.B: 12-15")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const comment = new TextInputBuilder()
				.setCustomId("comment")
				.setLabel("Kommentar")
				.setPlaceholder("z.B: Incs umbenennen, etc")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);

			const accountNameRow = new ActionRowBuilder().addComponents(accountField);
			const uvChoiceRow = new ActionRowBuilder().addComponents(uvChoice);
			const timeRow = new ActionRowBuilder().addComponents(time);
			const commentRow = new ActionRowBuilder().addComponents(comment);

			modal.addComponents(accountNameRow, uvChoiceRow, timeRow, commentRow);
			await interaction.showModal(modal);
		}
	},
};
