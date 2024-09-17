/*const puppeteer = require('puppeteer');
const request = require('request');
const tesseract = require('node-tesseract-ocr');

const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const { inlineCode } = require('discord.js');

const config2 = {
	lang: 'eng',
	oem: 1,
	psm: 6,
};

const processedMessages = new Set();
*/
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

				tesseract
					.recognize(imageUrl, config2)
					.then((text) => {
						//console.log('Result:', text);
						//channel.send(text);
						processedMessages.add(message.id);
					})
					.catch((error) => {
						console.log(error.message);
					});
			}
		}*/
	},
};
/*
module.exports = {
	name: 'messageCreate',
	run: async (message, client) => {
		if (message.author.bot) return;

		if (processedMessages.has(message.id)) return;

		let channel;
		channel = await client.channels.cache.get('1167380107028074526');

		if (message.channel.id === channel.id) {
			if (message.attachments.size > 0) {
				const attachment = message.attachments.first();
				const imageUrl = attachment.url;

				tesseract
					.recognize(imageUrl, config2)
					.then((text) => {
						console.log('Result:', text);
						if (text.trim() === '') {
							channel.send('Nichts erkannt');
						} else {
							channel.send(text);
						}
						processedMessages.add(message.id);
					})
					.catch((error) => {
						console.log(error.message);
					});
			}
		}
	},
};*/
