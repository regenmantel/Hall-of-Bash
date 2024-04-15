const config = require('../../Credentials/Config.js');
const fs = require('fs').promises;

module.exports = {
	name: 'freundschaft',
	run: async (client, interaction) => {
		const freundschaftInput = interaction.fields.getTextInputValue('freundschaft');

		if (!freundschaftInput) {
			await interaction.reply({
				content: `Please enter a value for 'freundschaft'.`,
				ephemeral: true,
			});
			return;
		}

		const freundschaft = parseInt(freundschaftInput);

		if (isNaN(freundschaft)) {
			await interaction.reply({
				content: `Please enter a valid number for 'freundschaft'.`,
				ephemeral: true,
			});
			return;
		}

		if (freundschaft < 1 || freundschaft > 20) {
			await interaction.reply({
				content: `Freundschaft must be between 1 and 20%.`,
				ephemeral: true,
			});
			return;
		}

		const configFilePath = 'Config.js';

		config.server2.freundschaft = freundschaft;

		try {
			await fs.writeFile(configFilePath, `module.exports = ${JSON.stringify(config, null, 4)};`);
			await interaction.reply({
				content: `Freundschaft has been updated to ${freundschaft}%.`,
				ephemeral: true,
			});
			console.log('Config updated successfully.');
		} catch (error) {
			console.error('Error updating config:', error);
			await interaction.reply({
				content: `An error occurred while updating the configuration.`,
				ephemeral: true,
			});
		}
	},
};
