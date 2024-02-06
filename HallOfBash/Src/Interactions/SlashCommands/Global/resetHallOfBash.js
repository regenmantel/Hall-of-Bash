const { conn } = require('../../../functions/conn');
const axios = require('axios');
const config = require('../../../Credentials/Config');

module.exports = {
	name: 'reset',
	description: 'Reset Hall of Bash DB',
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],
	run: async (client, interaction) => {
		await conn('UPDATE `hallofbash` SET bashPoints = 0');
		await interaction.reply({ content: `Hall of Bash wurde zurückgesetzt.`, ephemeral: true });
	},
};
