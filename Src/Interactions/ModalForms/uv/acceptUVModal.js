const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { conn } = require("../../../functions/conn");
const config = require("../../../Credentials/Config");
const fs = require("fs");

const loadSpecialRoles = (file) => {
	return fs
		.readFileSync(file, "utf8")
		.split("\n")
		.map((role) => role.trim())
		.filter((role) => role.length > 0);
};

module.exports = {
	name: "acceptUVModal",
	run: async (client, interaction) => {
		let userId = interaction.user.id;
		if (interaction.isModalSubmit()) {
			let uvChannel = client.channels.cache.find(
				(channel) => channel.id === config.server.channels.uvChannel
			);

			const specialRoles = loadSpecialRoles("./skrMember.txt");

			const member = interaction.guild.members.cache.get(userId);
			if (!member) {
				console.error("Mitglied nicht gefunden.");
				return;
			}

			const userRoles = member.roles.cache
				.filter((role) => role.name !== "@everyone")
				.map((role) => role.name);

			const matchingRoles = userRoles.filter((role) => specialRoles.includes(role));
			const matchingRolesString =
				matchingRoles.length > 0
					? matchingRoles.join(", ")
					: "Keine übereinstimmenden Rollen gefunden.";

			console.log(`Übereinstimmende Rollen für ${member.user.username}:`, matchingRoles);

			const messageId = interaction.message.id;
			const [rows] = await conn(`SELECT * FROM \`uv\` WHERE messageId = ?`, [messageId]);

			const currentAcceptedTimes = rows["timeAcceptedUserId"];
			let time = interaction.fields.getTextInputValue("time");

			let timeDB = rows["time"];
			console.log(timeDB);
			let [startInput, endInput] = time.split("-").map(Number);

			let dbPeriods = timeDB.split(",").map((period) => period.split("-").map(Number));
			console.log("Datenbank-Zeiträume:", dbPeriods);

			let newTimes = [];
			let hasValidOverlap = false;
			let coveredPeriods = [];

			for (let i = 0; i < dbPeriods.length; i++) {
				let [startDB, endDB] = dbPeriods[i];

				console.log(
					`Überprüfe Zeitraum: ${startInput}-${endInput} gegen ${startDB}-${endDB}`
				);

				if (startInput < endDB && endInput > startDB) {
					let uvChoice = rows["uvChoice"];
					let timeAddedToDB = 0;

					let timeAccepted = endInput - startInput;

					if (
						uvChoice === "Incs senden" ||
						uvChoice === "Deff-Aktion" ||
						uvChoice === "AGs timen"
					) {
						timeAddedToDB = calculateTimeAddedToDB(uvChoice, timeAccepted);
					} else {
						timeAddedToDB = timeAccepted;
					}

					await conn(
						`INSERT INTO \`uvRanking\` (accountName, userId, uvChoice, time, points) VALUES (?, ?, ?, ?, ?)`,
						[matchingRolesString, userId, uvChoice, timeAccepted, timeAddedToDB]
					);

					console.log(
						`Überlappung festgestellt: ${startInput}-${endInput} mit ${startDB}-${endDB}`
					);
					hasValidOverlap = true;

					coveredPeriods.push([Math.max(startInput, startDB), Math.min(endInput, endDB)]);

					if (startInput > startDB) {
						newTimes.push(`${startDB}-${startInput}`);
					}

					if (endInput < endDB) {
						newTimes.push(`${endInput}-${endDB}`);
					}

					dbPeriods.splice(i, 1);
					i--;
					continue;
				} else {
					console.log(
						`Keine Überlappung: ${startInput}-${endInput} und ${startDB}-${endDB}`
					);
				}
			}

			dbPeriods.forEach(([s, e]) => {
				if (!(startInput <= e && endInput >= s)) {
					newTimes.push(`${s}-${e}`);
				}
			});

			newTimes = newTimes
				.map((time) => time.split("-").map(Number))
				.filter(([start, end]) => start < end)
				.map(([start, end]) => `${start}-${end}`);

			let totalCovered = 0;
			coveredPeriods.sort((a, b) => a[0] - b[0]);
			for (let i = 0; i < coveredPeriods.length; i++) {
				let [startCovered, endCovered] = coveredPeriods[i];
				totalCovered += endCovered - startCovered;

				if (i < coveredPeriods.length - 1 && endCovered >= coveredPeriods[i + 1][0]) {
					coveredPeriods[i + 1][0] = Math.min(startCovered, coveredPeriods[i + 1][0]);
					coveredPeriods[i + 1][1] = Math.max(endCovered, coveredPeriods[i + 1][1]);
					totalCovered -= endCovered - coveredPeriods[i + 1][0];
				}
			}

			if (totalCovered < endInput - startInput) {
				await interaction.reply({
					content:
						"❌ Der eingegebene Zeitraum überschneidet sich nicht vollständig mit den vorhandenen Zeiträumen oder ist ungültig.",
					ephemeral: true,
				});
				return;
			}

			let acceptedTimeEntry = `${startInput}-${endInput}:${userId}`;

			let newAcceptedTimes = currentAcceptedTimes
				.split(",")
				.filter(
					(entry) =>
						entry.trim() !== "" && !entry.startsWith(`${startInput}-${endInput}:`)
				)
				.concat(acceptedTimeEntry)
				.join(",");

			await conn(
				`UPDATE \`uv\` SET \`time\` = ?, \`timeAcceptedUserId\` = ? WHERE \`messageId\` = ?`,
				[newTimes.join(", "), newAcceptedTimes, messageId]
			);

			let formattedAcceptedTimes = newAcceptedTimes
				.split(",")
				.map((entry) => entry.trim())
				.filter((entry) => entry.length > 0)
				.map((entry) => {
					let [period, userId] = entry.split(":");
					let [start, end] = period.split("-").map(Number);
					return { period, userId, start, end };
				})
				.sort((a, b) => a.start - b.start)
				.map(({ period, userId }) => `${period} Uhr: <@${userId}>`)
				.join("\n");

			if (time === rows["time"] && rows["status"] === 0) {
				await interaction.message.edit({
					content: `<@&${config.server.roles.world}> **${rows["accountName"]}** benötigt eine UV: **${rows["uvChoice"]}**\n\nÜbernommene Zeiten:\n${formattedAcceptedTimes}\n\n\`\`\`To-Do:\n${rows["comment"]}\`\`\``,
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId("acceptedUV")
								.setLabel("UV wurde angenommen")
								.setStyle(ButtonStyle.Secondary)
								.setEmoji("🔐")
								.setDisabled(true)
						),
					],
				});

				await interaction.reply({
					content: `✅ Die hast die UV von **${rows["accountName"]}** für den Zeitraum von **${time}** angenommen.`,
					ephemeral: true,
				});

				await conn(`UPDATE \`uv\` SET \`status\` = ? WHERE \`messageId\` = ?`, [
					1,
					messageId,
				]);
				await uvChannel.send(`✅ <@${rows["userId"]}>, deine UV-Anfrage ist erledigt. `);
			} else {
				await interaction.message.edit({
					content: `<@&${config.server.roles.world}> **${
						rows["accountName"]
					}** benötigt eine UV: **${
						rows["uvChoice"]
					}**\n\nZeitraum offen: ${newTimes.join(
						", "
					)} Uhr\n\nÜbernommene Zeiten:\n${formattedAcceptedTimes}\n\n\`\`\`To-Do:\n${
						rows["comment"]
					}\`\`\``,
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId(`acceptUV`)
								.setLabel("✅ UV Annehmen")
								.setStyle(ButtonStyle.Success)
						),
					],
				});

				await interaction.reply({
					content: `✅ Die hast die UV von **${rows["accountName"]}** für den Zeitraum von **${startInput}-${endInput}** angenommen.`,
					ephemeral: true,
				});
			}
		}
	},
};

function calculateTimeAddedToDB(uvChoice, timeAccepted) {
	let timeAddedToDB = 0;

	const timeMappings = {
		"Incs senden": [
			{ threshold: 1, points: 1 },
			{ threshold: 3, points: 3 },
			{ threshold: Infinity, points: 4 },
		],
		"Deff-Aktion": [
			{ threshold: 1, points: 1 },
			{ threshold: 3, points: 3 },
			{ threshold: 6, points: 5 },
			{ threshold: 9, points: 7 },
			{ threshold: Infinity, points: 9 },
		],
		"AGs timen": [
			{ threshold: 1, points: 1 },
			{ threshold: 4, points: 3 },
			{ threshold: Infinity, points: 6 },
		],
	};

	if (timeMappings[uvChoice]) {
		const intervals = timeMappings[uvChoice];

		for (const interval of intervals) {
			if (timeAccepted <= interval.threshold) {
				timeAddedToDB = interval.points;
				break;
			}
		}
	} else {
		timeAddedToDB = timeAccepted;
	}

	return timeAddedToDB;
}
