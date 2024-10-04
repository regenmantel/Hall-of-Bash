const { conn } = require("../functions/conn");
const config = require("../Credentials/Config");

const sendUVRanking = async function sendUVRanking(client) {
	let uvRankingChannel = client.channels.cache.find(
		(channel) => channel.id === config.server.channels.uvRankingChannel
	);
	//let user = client.users.cache.find((user) => user.id === '401882349970915331');
	let tableName = "uvRanking";

	let sql = await conn(`SELECT accountName, SUM(points) AS totalPoints
                FROM \`${tableName}\`
                GROUP BY accountName
                ORDER BY totalPoints DESC`);

	let rankMessage = "🛡️ UV Rangliste 🛡️\n\n";

	const emojis = [":first_place:", ":second_place:", ":third_place:", ":medal:"];

	if (sql.length > 0) {
		sql.forEach((row, index) => {
			rankMessage += `${emojis[index]} ${row.accountName}: ${row.totalPoints}\n`;
		});
	} else {
		rankMessage += `Keine UV's gespielt.`;
	}

	const messages = await uvRankingChannel.messages.fetch({ limit: 1 });
	messages.forEach((message) => message.delete());

	await delay(500);
	await uvRankingChannel.send(rankMessage);
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

exports.sendUVRanking = sendUVRanking;
