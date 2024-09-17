const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { conn } = require("../../../functions/conn");

module.exports = {
	name: "uvModal",
	run: async (client, interaction) => {
		if (interaction.isModalSubmit()) {
			try {
				const accountName = interaction.fields.getTextInputValue("accountName");
				const uvChoice = interaction.fields.getTextInputValue("uvChoice");
				const time = interaction.fields.getTextInputValue("time");
				const comment = interaction.fields.getTextInputValue("comment");

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`acceptUV`)
						.setLabel("✅ UV Annehmen")
						.setStyle(ButtonStyle.Success)
				);

				const reply = await interaction.reply({
					content: `w221 **${accountName}** benötigt eine UV: **${uvChoice}**\n\nZeitraum: ${time} Uhr\n\n\`\`\`To-Do:\n${comment}\`\`\``,
					components: [row],
					ephemeral: false,
					fetchReply: true,
				});

				await conn(
					`INSERT INTO \`uv\` (messageId, accountName, uvChoice, comment, time, userId, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
					[reply.id, accountName, uvChoice, comment, time, interaction.user.id, 0]
				);
			} catch (error) {
				console.error("Fehler beim Speichern der Modal-Daten:", error);
				await interaction.reply({
					content: "❌ Fehler beim Verarbeiten der Modal-Daten.",
					ephemeral: true,
				});
			}
		}
	},
};
