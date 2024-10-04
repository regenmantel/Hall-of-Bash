const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { conn } = require("../../../functions/conn");
const config = require("../../../Credentials/Config");

module.exports = {
	name: "uvModal",
	run: async (client, interaction) => {
		if (interaction.isModalSubmit()) {
			try {
				let uvChannel = client.channels.cache.find(
					(channel) => channel.id === config.server.channels.uvChannel
				);

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

				try {
					let reply = await uvChannel.send({
						content: `<@&${config.server.roles.world}> **${accountName}** benötigt eine UV: **${uvChoice}**\n\nZeitraum: ${time} Uhr\n\n\`\`\`To-Do:\n${comment}\`\`\``,
						components: [row],
						ephemeral: false,
						fetchReply: true,
					});

					await conn(
						`INSERT INTO \`uv\` (messageId, accountName, uvChoice, comment, time, timeAcceptedUserId, userId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
						[reply.id, accountName, uvChoice, comment, time, "", interaction.user.id, 0]
					);

					let messageLink = `https://discord.com/channels/${config.server.serverId}/${config.server.channels.uvChannel}/${reply.id}`;

					await interaction.reply({
						content: `:tada: Du hast deine UV-Anfrage erfolgreich abgeschickt. \n\nDu findest sie hier ${messageLink}`,
						ephemeral: true,
					});
				} catch (error) {
					console.error(
						"Fehler beim Senden der Nachricht oder Einfügen in die Datenbank:",
						error
					);
				}
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
