const { conn } = require("../../../../functions/conn");
const config = require("../../../../Credentials/Config");
const axios = require("axios");

module.exports = {
	name: "hallofbash",
	description: "Hall of Bash Top 3",
	onlyRoles: [config.server.roles.sf, config.server.roles.mod],
	run: async (client, interaction) => {
		let tableName = "de233";

		//let top = await conn(`SELECT bashPoints, igAccountName FROM \`${tableName}\` ORDER BY bashPoints DESC LIMIT 3;`);

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
				top[i].igAccountName = " ";
			}
		}

		let url = `https://rrregenmantel.de/hallofbash/${tableName}/${tableName}.php?`;
		for (let i = 0; i < Math.min(top.length, 3); i++) {
			url += `rang${i + 1}=${top[i].igAccountName}&bash${i + 1}=${top[i].bashPoints}&`;
		}

		url = url.slice(0, -1);
		let img;
		try {
			await axios.get(url);
			img = `https://rrregenmantel.de/hallofbash/${tableName}/bashpoints.jpeg?timeunix=${Date.now()}`;
		} catch (error) {
			console.error("Error while making the request:", error);
		}

		await delay(300);

		await interaction.reply({ content: img, ephemeral: true });
	},
};

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
