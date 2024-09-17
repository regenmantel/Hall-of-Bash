const config = require('../../Credentials/Config');
const { inlineCode } = require('discord.js');
const talkedRecently = new Set();
let imgURL = 'https://diestaemmedb.de/discord/fuckoff.gif';

module.exports = {
	name: 'sd',
	run: async (client, interaction) => {
		if (talkedRecently.has(interaction.user.id)) {
			await interaction.reply({
				content: `Spam doch nicht du Lappen.`,
				ephemeral: true,
			});
			return;
		}
		talkedRecently.add(interaction.user.id);
		setTimeout(() => {
			talkedRecently.delete(interaction.user.id);
		}, 60000 * 5);

		const user = client.users.cache.find((user) => user.id === '731887628831555666');

		let sdChannel;
		let sfRole, modRole;
		if (interaction.guild.id === config.server.serverId) {
			sdChannel = interaction.guild.channels.cache.get(config.server.channels.sdChannel);
			sfRole = config.server.roles.sf;
			modRole = config.server.roles.mod;

			if (interaction.user.id === '731887628831555666') {
				user.send({
					files: [
						{
							attachment: imgURL,
						},
					],
					content: 'Nerv nicht Albaner',
				});
			} else {
				await sdChannel.send(`⚔️ <@&${sfRole}> <@&${modRole}> - Es wurde SD im Forum beantragt von ${inlineCode(interaction.member.displayName)}. ⚔️`);
			}
		} else {
			await interaction.reply({ content: 'Ungültiger Server', ephemeral: true });
			return;
		}

		await interaction.reply({
			content: `Deine SD Anfrage wurde abgeschickt. ⚔️`,
			ephemeral: true,
		});
	},
};
