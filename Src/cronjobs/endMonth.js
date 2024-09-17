const { inlineCode, Client, GatewayIntentBits, Partials, ChannelType, PermissionsBitField } = require('discord.js');
const axios = require('axios');

const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const endMonth = async function endMonth(client) {
	const rankEmoji = [':first_place:', ':second_place:', ':third_place:'];

	const hallOfBashChannel = client.channels.cache.find((channel) => channel.id === config.server.channels.hobChannel);
	const user = client.users.cache.find((user) => user.id === '401882349970915331');
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

	const monthNames = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
	let currentMonth = new Date().getMonth();
	//await conn('INSERT INTO `streaks` (month, igAccountName, bashPoints) VALUES (?, ?, ?)', [monthNames[currentMonth], top[0].igAccountName, top[0].bashPoints]);

	for (let i = 0; i < top.length; i++) {
		if (top[i].bashPoints <= 0) {
			top[i].igAccountName = ' ';
		}
	}

	let url = `https://rrregenmantel.de/hallofbash/${tableName}/${tableName}.php?`;
	let winnerMessage = '';

	for (let i = 0; i < Math.min(top.length, 3); i++) {
		url += `rang${i + 1}=${top[i].igAccountName}&bash${i + 1}=${top[i].bashPoints}&`;
		winnerMessage += `${rankEmoji[i]} Rang ${i + 1}: ${top[i].igAccountName}\n`;
	}

	url = url.slice(0, -1);
	let img;
	axios
		.get(url)
		.then(async (response) => {
			img = `https://rrregenmantel.de/hallofbash/${tableName}/bashpoints.jpeg?timeunix=${Date.now()}`;
		})
		.catch((error) => {
			console.error('Error while making the request:', error);
		});

	await hallOfBashChannel.messages.fetch({ limit: 1 }).then((messages) => {
		messages.forEach((message) => message.delete());
	});

	await delay(500);
	await hallOfBashChannel.send(`⚔️ Ende der Hall of Bash für ${monthNames[currentMonth]} ⚔️\n\n${winnerMessage}`);
	await hallOfBashChannel.send(img);
	await user.send(img);
	await user.send(`⚔️ Ergebnis der Hall of Bash für ${monthNames[currentMonth]} 2024 ⚔️\n\n${winnerMessage}`);

	await conn(`UPDATE \`${tableName}\ SET bashPoints = 0;`);

	return new Promise((resolve) => {
		resolve();
	});
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

exports.endMonth = endMonth;
