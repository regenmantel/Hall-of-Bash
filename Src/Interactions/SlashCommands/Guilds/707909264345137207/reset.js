const { conn } = require("../../../../functions/conn");
const config = require("../../../../Credentials/Config");

module.exports = {
	name: "reset",
	description: "Reset Hall of Bash",
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],
	run: async (interaction) => {
		let tableName = "de233";

		await conn(`UPDATE \`${tableName}\` SET bashPoints = 0;`);
		await interaction.reply({ content: `Hall of Bash wurde zurückgesetzt.`, ephemeral: true });
	},
};
