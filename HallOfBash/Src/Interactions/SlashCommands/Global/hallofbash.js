const { conn } = require('../../../functions/conn');
const axios = require('axios');
const config = require('../../../Credentials/Config');
/**
 * 
 * 
 * 		const guild = client.guilds.cache.get('707909264345137207');

		// This takes ~1 hour to update
		// This updates immediately
		guild.commands.set([]);
 */
module.exports = {
	name: 'hallofbash',
	description: 'Hall of Bash Top 3',
	onlyRoles: [config.server.roles.sf, config.server.roles.mod, config.server2.roles.sf],
	run: async (client, interaction) => {
		let tableName;
		if (interaction.guild.id === config.server.serverId) {
			tableName = 'de221';
		} else if (interaction.guild.id === config.server2.serverId) {
			tableName = 'de225';
		} else {
			await interaction.reply({ content: 'Ungültiger Server', ephemeral: true });
			return;
		}

		let top = await conn(`SELECT bashPoints, igAccountName FROM \`${tableName}\` ORDER BY bashPoints DESC LIMIT 3;`);

		for (let i = 0; i < top.length; i++) {
			if (top[i].bashPoints <= 0) {
				top[i].igAccountName = ' ';
			}
		}

		let url = `https://rrregenmantel.de/hallofbash/${tableName}/${tableName}.php?`;
		for (let i = 0; i < Math.min(top.length, 3); i++) {
			url += `rang${i + 1}=${top[i].igAccountName}&bash${i + 1}=${top[i].bashPoints}&`;
		}

		url = url.slice(0, -1);
		let img;
		try {
			const response = await axios.get(url);
			img = `https://rrregenmantel.de/hallofbash/${tableName}/bashpoints.jpeg?timeunix=${Date.now()}`;
		} catch (error) {
			console.error('Error while making the request:', error);
		}

		await delay(300);

		await interaction.reply({ content: img, ephemeral: true });
	},
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
