//const { createWorker, PSM } = require('tesseract.js');

const processedMessages = new Set();

module.exports = {
	name: 'messageCreate',
	run: async (message, client) => {
		/*if (message.author.bot) return;

		if (processedMessages.has(message.id)) return;

		let channel;
		channel = await client.channels.cache.get('1167380107028074526');

		if (message.channel.id === channel.id) {
			if (message.attachments.size > 0) {
				const attachment = message.attachments.first();

				const imageUrl = attachment.url;

				(async () => {
					const worker = await createWorker('eng', 1, {
						logger: (m) => console.log(m),
					});
					await worker.setParameters({
						tessedit_char_whitelist: '0123456789:.aum ',
						tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
					});
					const {
						data: { text },
					} = await worker.recognize(imageUrl);
					channel.send(text);
					processedMessages.add(message.id);
					await worker.terminate();
				})();
			}
		}*/
	},
};
