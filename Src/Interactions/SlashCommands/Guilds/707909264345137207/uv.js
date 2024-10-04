const config = require("../../../../Credentials/Config");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { conn } = require("../../../../functions/conn");

module.exports = {
	name: "uv",
	description: "UV Anfragen",
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],
	options: [
		{
			name: "account",
			type: 3,
			description: "Gib den Accountnamen an, an welchen du Punkte vergeben willst.",
			required: false,
		},
		{
			name: "points",
			type: 4,
			description: "Anzahl der Punkte",
			required: false,
		},
		{
			name: "reason",
			type: 3,
			description: "Grund warum der Account noch zusätzlich manuell Punkte bekommen hat.",
			required: false,
		},
	],

	run: async (client, interaction) => {
		let tableName = "uvRanking";
		let userId = interaction.user.id;
		let accountName = interaction.options.getString("account");
		let points = interaction.options.getInteger("points");
		let reason = interaction.options.getString("reason");

		if (!accountName || points == null) {
			await sendModalMessage(interaction);
			return;
		}

		try {
			await interaction.deferReply();

			await conn(
				`INSERT INTO \`${tableName}\` (accountName, userId, uvChoice, time, points, reason) VALUES (?, ?, ?, ?, ?, ?)`,
				[accountName, userId, "manuell", 0, points, reason]
			);

			await interaction.followUp(
				`✅ **${accountName}** hat gerade **${points} Punkte** fürs UV-Ranking bekommen. \n\nBegründung: **${reason}**`
			);
		} catch (error) {
			await interaction.followUp("❌ Es gab einen Fehler beim Hinzufügen der Punkte.");
		}
	},
};

async function sendModalMessage(interaction) {
	await interaction.deferReply();

	const uvEmbed = new EmbedBuilder()
		.setTitle("Skrupellos®")
		.setDescription("Du benötigst eine UV? Frag hier um eine an!")
		.setColor(0xed3d7d);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("deff_uv")
			.setLabel("🛡️ Deff-Aktion")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("kampf_uv")
			.setLabel("🗡️ Incs senden")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId("ags_uv")
			.setLabel("🕑 AGs timen")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId("other")
			.setLabel("Sonstiges")
			.setStyle(ButtonStyle.Secondary)
	);

	await interaction.followUp({
		embeds: [uvEmbed],
		components: [row],
	});
}
