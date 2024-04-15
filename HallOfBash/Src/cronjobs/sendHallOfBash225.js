const axios = require('axios');
const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const sendHallOfBash225 = async function sendHallOfBash(client) {
	let hallOfBashChannel = client.channels.cache.find((channel) => channel.id === config.server2.channels.hobChannel);
	let user = client.users.cache.find((user) => user.id === '401882349970915331');
	let tableName = 'de225';

	let top = await conn(`SELECT bashPoints, igAccountName FROM \`${tableName}\` ORDER by bashPoints DESC LIMIT 3;`);

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

	try {
		const messages = await hallOfBashChannel.messages.fetch({ limit: 1 });
		messages.forEach((message) => message.delete());
		await delay(500);
		await hallOfBashChannel.send(img);
	} catch (error) {
		console.error('Error while sending message:', error);
	}
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
exports.sendHallOfBash225 = sendHallOfBash225;
