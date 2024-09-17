const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { conn } = require("../../../functions/conn");

module.exports = {
	name: "acceptUV",
	run: async (client, interaction) => {
		if (interaction.isButton()) {
			const messageId = interaction.message.id;
			const [rows] = await conn(`SELECT * FROM \`uv\` WHERE messageId = ?`, [messageId]);

			if (rows.length === 0) {
				await interaction.reply({
					content: "❌ Keine Daten gefunden für diese Nachricht-ID.",
					ephemeral: true,
				});
				return;
			}

			if (rows["status"] == 0) {
				const modal = new ModalBuilder()
					.setCustomId("acceptUVModal")
					.setTitle("Gib einen Zeitraum ein:");

				const time = new TextInputBuilder()
					.setCustomId("time")
					.setLabel("Zeitraum")
					.setPlaceholder("z.B: 12-15")
					.setStyle(TextInputStyle.Short)
					.setRequired(true);

				const timeRow = new ActionRowBuilder().addComponents(time);
				modal.addComponents(timeRow);

				await interaction.showModal(modal);
			}
		}
	},
};
