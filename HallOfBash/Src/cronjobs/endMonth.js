const { inlineCode, Client, GatewayIntentBits, Partials, ChannelType, PermissionsBitField } = require('discord.js');
const axios = require('axios');

const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const endMonth = async function endMonth(client) {
	const user = client.users.cache.find((user) => user.id === '401882349970915331');

	let top = await conn('SELECT bashPoints, igAccountName FROM `hallofbash` ORDER by bashPoints DESC LIMIT 3;');

	for (let i = 0; i < top.length; i++) {
		if (top[i].bashPoints <= 0) {
			top[i].igAccountName = ' ';
		}
	}

	let url = 'https://diestaemmedb.de/testOsse/test.php?';

	for (let i = 0; i < Math.min(top.length, 3); i++) {
		url += `rang${i + 1}=${top[i].igAccountName}&bash${i + 1}=${top[i].bashPoints}&`;
	}

	url = url.slice(0, -1);
	let img;
	axios
		.get(url)
		.then(async (response) => {
			img = `https://diestaemmedb.de/testOsse/bashpoints.jpeg?timeunix=${Date.now()}`;
		})
		.catch((error) => {
			console.error('Error while making the request:', error);
		});
	await delay(300);

	await user.send(img);

	await conn('UPDATE `hallofbash` SET bashpoints = 0');

	return new Promise((resolve) => {
		resolve();
	});
};

exports.endMonth = endMonth;
