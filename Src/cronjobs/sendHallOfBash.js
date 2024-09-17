const { conn } = require('../functions/conn');
const axios = require('axios');
const config = require('../Credentials/Config');

const sendHallOfBash = async function sendHallOfBash(client) {
	console.log("test");
	let hallOfBashChannel = client.channels.cache.find((channel) => channel.id === config.server.channels.hobChannel);
	//let user = client.users.cache.find((user) => user.id === '401882349970915331');
	let tableName = 'de221';

	//let top = await conn(`SELECT bashPoints, igAccountName FROM \`${tableName}\` ORDER by bashPoints DESC LIMIT 3;`);

	let top = await conn(`
							WITH RankedAccounts AS (
								SELECT
									igAccountName,
									bashPoints,
									ROW_NUMBER() OVER (PARTITION BY igAccountName ORDER BY bashPoints DESC) AS rn
								FROM
									\`${tableName}\`
							),
							FilteredAccounts AS (
								SELECT
									igAccountName,
									bashPoints
								FROM
									RankedAccounts
								WHERE
									rn = 1
							)
						SELECT
							igAccountName,
							bashPoints
						FROM
							FilteredAccounts
						ORDER BY
							bashPoints DESC
						LIMIT 4;
						`);

	if (top.length > 1 && top[1].igAccountName === top[0].igAccountName) {
		top.splice(1, 1);
	}

	top = top.slice(0, 3);
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

exports.sendHallOfBash = sendHallOfBash;
