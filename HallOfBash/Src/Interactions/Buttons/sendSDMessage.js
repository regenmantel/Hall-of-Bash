const config = require('../../Credentials/Config');
const { inlineCode } = require('discord.js');
const talkedRecently = new Set();

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

		let sdChannel;
		let sfRole, modRole;
		if (interaction.guild.id === config.server.serverId) {
			sdChannel = interaction.guild.channels.cache.get(config.server.channels.sdChannel);
			sfRole = config.server.roles.sf;
			modRole = config.server.roles.mod;

			await sdChannel.send(`⚔️ <@&${sfRole}> <@&${modRole}> - Es wurde SD im Forum beantragt von ${inlineCode(interaction.member.displayName)}. ⚔️`);
		} else if (interaction.guild.id === config.server2.serverId) {
			sdChannel = interaction.guild.channels.cache.get(config.server2.channels.sdChannel);
			sfRole = config.server2.roles.sf;

			await sdChannel.send(`⚔️ <@&${sfRole}> - Es wurde SD im Forum beantragt von ${inlineCode(interaction.member.displayName)}. ⚔️`);
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
