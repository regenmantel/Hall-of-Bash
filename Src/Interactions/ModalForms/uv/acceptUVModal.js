const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { conn } = require("../../../functions/conn");

module.exports = {
	name: "acceptUVModal",
	run: async (client, interaction) => {
		if (interaction.isModalSubmit()) {
			const messageId = interaction.message.id;
			const [rows] = await conn(`SELECT * FROM \`uv\` WHERE messageId = ?`, [messageId]);

			if (rows.length === 0) {
				await interaction.reply({
					content: "❌ Keine Daten gefunden für diese Nachricht-ID.",
					ephemeral: true,
				});
				return;
			}

			let time = interaction.fields.getTextInputValue("time");

			console.log(time);
			console.log(rows["time"]);

			if (time === rows["time"] && rows["status"] === 0) {
				await interaction.message.edit({
					content: `w221 **${rows["accountName"]}** benötigt eine UV: **${rows["uvChoice"]}**\n\n\`\`\`To-Do:\n${rows["comment"]}\`\`\``,
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
					content: `✅ Die UV von **${rows["accountName"]}** wurde von <@${interaction.user.id}> angenommen von ${time} Uhr.`,
					ephemeral: false,
				});

				await conn(`UPDATE \`uv\` SET \`status\` = ? WHERE \`messageId\` = ?`, [
					1,
					messageId,
				]);
			} else {
				let timeDB = rows["time"];
				let [startInput, endInput] = time.split("-").map(Number);

				let dbPeriods = timeDB.split(",").map((period) => period.split("-").map(Number));
				console.log("Datenbank-Zeiträume:", dbPeriods);

				let newTimes = [];
				let isOverlapping = false;

				for (const [startDB, endDB] of dbPeriods) {
					console.log(
						`Überprüfe Zeitraum: ${startInput}-${endInput} gegen ${startDB}-${endDB}`
					);

					if (startInput <= endDB && endInput >= startDB) {
						console.log(
							`Überlappung festgestellt: ${startInput}-${endInput} mit ${startDB}-${endDB}`
						);
						isOverlapping = true;

						if (startInput > startDB) {
							newTimes.push(`${startDB}-${startInput}`);
						}

						if (endInput < endDB) {
							newTimes.push(`${endInput}-${endDB}`);
						}

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

				console.log("Neuer Zeiträume:", newTimes);

				if (newTimes.length === 0) {
					await interaction.reply({
						content:
							"❌ Der eingegebene Zeitraum überschneidet sich nicht mit den vorhandenen Zeiträumen oder ist ungültig.",
						ephemeral: true,
					});
					return;
				}

				await interaction.message.edit({
					content: `w221 **${rows["accountName"]}** benötigt eine UV: **${
						rows["uvChoice"]
					}**\n\nZeitraum: ${newTimes.join(", ")} Uhr\n\n\`\`\`To-Do:\n${
						rows["comment"]
					} \`\`\``,
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
					content: `✅ Die UV von **${rows["accountName"]}** wurde von <@${interaction.user.id}> angenommen von ${time} Uhr.`,
					ephemeral: false,
				});

				await conn(`UPDATE \`uv\` SET \`time\` = ? WHERE \`messageId\` = ?`, [
					newTimes.join(", "),
					messageId,
				]);
			}
		}
	},
};
