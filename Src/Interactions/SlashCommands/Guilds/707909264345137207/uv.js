const config = require("../../../../Credentials/Config");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "uv",
	description: "UV Anfragen",
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],

	run: async (client, interaction) => {
		const uvEmbed = new EmbedBuilder();

		uvEmbed
			.setTitle("Skrupellos®")
			.setDescription("Du benötigst eine UV? Frag hier um eine an!")
			.setColor(0xed3d7d);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("kampf_uv")
				.setLabel("🗡️ Off-Aktion")
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("deff_uv")
				.setLabel("🛡️ Deff-Aktion")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("ags_uv")
				.setLabel("🕑 AGs timen")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("praegen_uv")
				.setLabel("🪙 Prägen")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId("other")
				.setLabel("Sonstiges")
				.setStyle(ButtonStyle.Secondary)
		);

		await interaction.reply({
			embeds: [uvEmbed],
			components: [row],
		});
	},
};
