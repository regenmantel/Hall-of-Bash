const { ActivityType } = require("discord.js");
const { bold } = require("chalk");
const { rootPath } = require("../../hallofbot");
const { statSync } = require("node:fs");
const { version } = require("../../package.json");
const directorySearch = require("node-recursive-directory");
const config = require("../Credentials/Config");

module.exports = {
	name: "ready",
	runOnce: true,
	run: async (client) => {
		const startTime = Date.now();
		let guildsList = "";
		let allSlashCommands = 0;
		let botStatusChannel = client.channels.cache.find(
			(channel) => channel.id === config.server.channels.botStatus
		);

		client.user.setPresence({
			activities: [{ name: `Hall of Bash`, type: ActivityType.Competing }],
			status: "dnd",
		});

		client.guilds.cache.forEach((guild) => {
			guildsList += `   ${guild.name} (${guild.id})\n`;
		});

		const slashCommandsTotalFiles = await directorySearch(
			`${rootPath}/Src/Interactions/SlashCommands`
		);

		await slashCommandsTotalFiles.forEach((cmdFile) => {
			if (statSync(cmdFile).isDirectory()) return;
			const slashCmd = require(cmdFile);
			if (!slashCmd.name || slashCmd.ignore || !slashCmd.run) return;
			else allSlashCommands++;
		});

		console.log(bold.green("[Client] ") + bold.blue(`Logged into ${client.user.tag}`));
		if (client.messageCommands.size > 0)
			console.log(
				bold.red("[MessageCommands] ") +
					bold.cyanBright(
						`Loaded ${client.messageCommands.size} MessageCommands with ${bold.white(
							`${client.messageCommandsAliases.size} Aliases`
						)}.`
					)
			);

		if (client.events.size > 0)
			console.log(
				bold.yellowBright("[Events] ") +
					bold.magenta(`Loaded ${client.events.size} Events.`)
			);

		if (client.buttonCommands.size > 0)
			console.log(
				bold.whiteBright("[ButtonCommands] ") +
					bold.greenBright(`Loaded ${client.buttonCommands.size} Buttons.`)
			);

		if (client.selectMenus.size > 0)
			console.log(
				bold.red("[SelectMenus] ") +
					bold.blueBright(`Loaded ${client.selectMenus.size} SelectMenus.`)
			);

		if (client.modalForms.size > 0)
			console.log(
				bold.cyanBright("[ModalForms] ") +
					bold.yellowBright(`Loaded ${client.modalForms.size} Modals.`)
			);

		if (allSlashCommands > 0)
			console.log(
				bold.magenta("[SlashCommands] ") +
					bold.white(`Loaded ${allSlashCommands} SlashCommands.`)
			);

		await botStatusChannel.send("Hall of Bash loading ...");

		const endTime = Date.now();
		const elapsedTime = endTime - startTime;

		console.log(startTime);
		console.log(endTime);

		await botStatusChannel.send(
			`\`\`\`Current version: ${version}\nConnected server: \n${guildsList}\nLoaded ${client.events.size} Events.\nLoaded ${client.buttonCommands.size} Buttons.\nLoaded ${client.selectMenus.size} SelectMenus.\nLoaded ${client.modalForms.size} Modals.\nLoaded ${allSlashCommands} SlashCommands.\n\nTime to load: ${elapsedTime}ms\n\nHall of Bash online!\n\`\`\``
		);
	},
};
