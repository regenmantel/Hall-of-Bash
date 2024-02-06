const config = require('../../Credentials/Config');
const { inlineCode } = require('discord.js');
const talkedRecently = new Set();

module.exports = {
	name: 'sda',
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

		const sdChannel = interaction.guild.channels.cache.get(config.server.channels.sdChannel);
		const sfRole = config.server.roles.sf;
		const modRole = config.server.roles.mod;

		await sdChannel.send(`⚔️ <@&${sfRole}> <@&${modRole}> - Es wurde SD im Forum beantragt von ${inlineCode(interaction.member.displayName)}. ⚔️`);

		await interaction.reply({
			content: `Deine SD Anfrage wurde abgeschickt. ⚔️`,
			ephemeral: true,
		});
	},
};
