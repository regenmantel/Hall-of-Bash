const config = require("../../../../Credentials/Config");

module.exports = {
	name: "clear",
	description: "Lösche alle Nachrichten eines Chats",
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],
	run: async (interaction, message) => {
		const channel = message.channel;

		async function clearMessages() {
			let fetched;
			do {
				fetched = await channel.messages.fetch({ limit: 100 });
				console.log(`Löschende Nachrichten: ${fetched.size}`);
				await channel
					.bulkDelete(fetched, true)
					.catch((error) => console.error("Fehler beim Löschen von Nachrichten:", error));
			} while (fetched.size >= 0);
		}

		await clearMessages();
		await message.reply("Alle Nachrichten wurden gelöscht.");
	},
};
