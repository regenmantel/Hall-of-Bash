const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');
const { ApplicationCommandType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, inlineCode, MessageActionRow, MessageButton } = require('discord.js');

const attacks = {
	attack: { name: '<:attack:1222467328369754184>' },
	attack_small: { name: '<:attack_small:1225813167901245551>' },
	attack_medium: { name: '<:attack_medium:1225813153393279067>' },
	attack_large: { name: '<:attack_large:1225813137614176287>' },
	snob: { name: '<:ag:1222927195664814231>' },
	spy: { name: '<:spaeher:1222927326979948564>' },
};

const einheitenLaufzeiten = {
	spear: { name: '<:speer:1222927642068779151> / <:axt:1222927519699959899>', unit: 'Speer', hours: 4, minutes: 30 },
	sword: { name: '<:schwert:1222927547570851840>', unit: 'Schwert', hours: 5, minutes: 30 },
	//axe: { name: '<:axt:1222927519699959899>', unit: 'Axt', hours: 4, minutes: 30 },
	spy: { name: '<:spaeher:1222927326979948564>', unit: 'Späher', hours: 0, minutes: 27 },
	light: { name: '<:lKav:1222927304099889304> / <:pala:1222927212827639848>', unit: 'Lkav', hours: 2, minutes: 30 },
	heavy: { name: '<:sKav:1222927265147654205>', unit: 'Skav', hours: 2, minutes: 45 },
	ram: { name: '<:ramme:1222927246981861436> / <:kata:1222927228120203356>', unit: 'Ramme', hours: 7, minutes: 30 },
	//kata: { name: '<:kata:1222927228120203356>', unit: 'Katapult', hours: 7, minutes: 30 },
	//pala: { name: '<:pala:1222927212827639848>', unit: 'Paladin', hours: 2, minutes: 30 },
};

function extractAnkunftszeit(nachricht) {
	const regex = /\[\/command\].*?([Aa][Gg]).*?Ankunftszeit: (\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2}):(\d{3})/;

	const match = nachricht.match(regex);
	console.log(match[1]);
	console.log(match[2]);
	console.log(match[3]);
	console.log(match[4]);
	console.log(match[5]);
	console.log(match[6]);
	console.log(match[7]);
	console.log(match[8]);
	if (match && match.length === 9) {
		const day = parseInt(match[2], 10);
		const month = parseInt(match[3], 10) - 1;
		const year = 2000 + parseInt(match[4], 10);
		const hours = parseInt(match[5], 10);
		const minutes = parseInt(match[6], 10);
		const seconds = parseInt(match[7], 10);
		const milliseconds = parseInt(match[8], 10);

		console.log('Parsed Date:', new Date(year, month, day, hours, minutes, seconds, milliseconds));
		return new Date(year, month, day, hours, minutes, seconds, milliseconds);
	}
	return null;
}

function calculateLaunchTime(nachricht, einheit) {
	const ankunftszeit = extractAnkunftszeit(nachricht);
	if (!ankunftszeit) {
		console.log('Ankunftszeit nicht gefunden');
		return null;
	}

	const { name, unit, hours: einheitH, minutes: einheitM } = einheitenLaufzeiten[einheit];

	const ankunftszeitMillis = ankunftszeit.getTime();
	const einheitLaufzeitMillis = einheitH * 60 * 60 * 1000 + einheitM * 60 * 1000;
	const absendungszeitMillis = ankunftszeitMillis - einheitLaufzeitMillis;

	console.log('Aktuelle Zeit (UTC):', new Date().toISOString());
	console.log('Absendungszeit (UTC):', new Date(absendungszeitMillis).toISOString());

	if (absendungszeitMillis > Date.now()) {
		const absendungszeitpunkt = new Date(absendungszeitMillis);
		return { name, unit, time: absendungszeitpunkt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
	} else {
		console.log('Einheit kommt nicht rechtzeitig an');
		return null;
	}
}

function calculateLaunchTime20P(nachricht, einheit) {
	const ankunftszeit = extractAnkunftszeit(nachricht);
	if (!ankunftszeit) {
		console.log('Ankunftszeit nicht gefunden');
		return null;
	}

	const { name, unit, hours: einheitH, minutes: einheitM } = einheitenLaufzeiten[einheit];

	// Reduziere die Laufzeit um 20%
	const beschleunigteEinheitH = einheitH * 0.93;
	const beschleunigteEinheitM = einheitM * 0.93;

	const ankunftszeitMillis = ankunftszeit.getTime();
	const einheitLaufzeitMillis = beschleunigteEinheitH * 60 * 60 * 1000 + beschleunigteEinheitM * 60 * 1000;
	const absendungszeitMillis = ankunftszeitMillis - einheitLaufzeitMillis;

	console.log('Aktuelle Zeit (UTC):', new Date().toISOString());
	console.log('Absendungszeit (UTC):', new Date(absendungszeitMillis).toISOString());

	if (absendungszeitMillis > Date.now()) {
		const absendungszeitpunkt = new Date(absendungszeitMillis);
		return { name, unit, time: absendungszeitpunkt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
	} else {
		console.log('Einheit kommt nicht rechtzeitig an');
		return null;
	}
}

module.exports = {
	name: 'messageCreate',
	run: async (message, client) => {
		let channel = await client.channels.cache.get('1218537947045957652');
		let friendshipEnabled = false;

		if (!message.author.bot && message.content.includes('[b]Dorf:[/b]') && message.channel === channel) {
			let neueNachricht = message.content.replace(/\[b\]/g, '**').replace(/\[\/b\]/g, '**');
			neueNachricht = neueNachricht.replace(/\[coord\](\d+)\|(\d+)\[\/coord\]/g, '[$1|$2](<https://de225.die-staemme.de/game.php?village=$1&screen=info_village&id=$1#$2;$3>)');

			const regex = /\[command\](.*?)\[\/command\]/g;

			neueNachricht = neueNachricht.replace(regex, (match, p1) => {
				const command = p1.trim();
				if (attacks[command]) {
					return attacks[command].name;
				} else {
					return match;
				}
			});

			neueNachricht = neueNachricht.replace(/\[player\](.*?)\[\/player\]/g, '$1');

			const messages = await channel.messages.fetch({ limit: 1 });
			messages.forEach((message) => message.delete());

			neueNachricht = `<@&1213233306116689920> \n\n${neueNachricht}`;
			await channel.send(neueNachricht);

			const einheitenArray = Object.entries(einheitenLaufzeiten);

			const sortedEinheiten = einheitenArray.map(([einheit, daten]) => {
				const launchTime = calculateLaunchTime(message.content, einheit);
				if (launchTime) {
					const { name, time, unit } = launchTime;
					return { name, time, unit, laufzeit: daten.hours * 60 + daten.minutes };
				} else {
					return null;
				}
			});

			const filteredEinheiten = sortedEinheiten.filter((einheit) => einheit !== null);

			// Sortieren und zu Embed hinzufügen
			filteredEinheiten.sort((a, b) => b.laufzeit - a.laufzeit);

			const embed = new EmbedBuilder().setTitle(`🎆 Abschickzeiten 🎆`).setColor(0xff5a00);

			filteredEinheiten.forEach((einheit) => {
				embed.addFields({
					name: `${einheit.name}`,
					value: `${einheit.time} Uhr`,
					inline: true,
				});
			});

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('toggleFreundschaft')
					.setLabel(friendshipEnabled ? 'Freundschaft aus' : 'Freundschaft an')
					.setStyle(ButtonStyle.Danger)
					.setDisabled(true)
					.setEmoji('🏳️'),
			);
			await channel.send({
				embeds: [embed],
				components: [row],
			});

			const filter = (interaction) => interaction.isButton() && interaction.customId === 'toggleFreundschaft';

			client.on('interactionCreate', async (interaction) => {
				if (!interaction.isButton()) return;

				if (filter(interaction)) {
					friendshipEnabled = !friendshipEnabled;
					const einheitenArray2 = Object.entries(einheitenLaufzeiten);

					const sortedEinheiten2 = einheitenArray2.map(([einheit, daten]) => {
						let launchTime;
						if (friendshipEnabled) {
							launchTime = calculateLaunchTime20P(message.content, einheit);
						} else {
							launchTime = calculateLaunchTime(message.content, einheit);
						}
						if (launchTime) {
							const { name, time, unit } = launchTime;
							return { name, time, unit, laufzeit: daten.hours * 60 + daten.minutes };
						} else {
							return null;
						}
					});

					const filteredEinheiten2 = sortedEinheiten2.filter((einheit) => einheit !== null);

					// Sortieren und zu Embed hinzufügen
					filteredEinheiten2.sort((a, b) => b.laufzeit - a.laufzeit);

					const updatedEmbed = new EmbedBuilder().setTitle(`🎆 Abschickzeiten 🎆`).setColor(0xed3d7d);

					filteredEinheiten2.forEach((einheit) => {
						updatedEmbed.addFields({
							name: `${einheit.name}`,
							value: `${einheit.time} Uhr`,
							inline: true,
						});
					});

					//await interaction.deferUpdate();

					// Hier solltest du updatedEmbed verwenden, um die Nachricht zu bearbeiten
					await interaction.message.edit({
						embeds: [updatedEmbed],
						components: [
							new ActionRowBuilder().addComponents(
								new ButtonBuilder()
									.setCustomId('toggleFreundschaft')
									.setLabel(friendshipEnabled ? 'Freundschaft aus' : 'Freundschaft an')
									.setStyle(ButtonStyle.Danger)
									.setDisabled(true)
									.setEmoji('🏳️'),
							),
						],
					});
				}
			});
		}
	},
};

/*

[b]Dorf:[/b] [coord]501|500[/coord]
[b]Wallstufe:[/b] 8
[b]Zustimmung:[/b] 1

[b]Verteidiger:[/b]  0  0  0  0  0  0  0  0  0  0  0 

    [command]attack_small[/command] [command]snob[/command] [command]spy[/command] Späh [coord]497|401[/coord] --> Ankunftszeit: 05.04.24 23:38:09:103 [player]TheGreatButcher[/player]
    [command]attack_small[/command] [command]snob[/command] [command]spy[/command] Späh [coord]515|402[/coord] --> Ankunftszeit: 05.04.24 12:33:08:363 [player]TheGreatButcher[/player]
    [command]attack[/command] Späh [coord]594|571[/coord] --> Ankunftszeit: 05.04.24 13:22:42:537 [player]sKiLeRiX[/player]
    [command]attack[/command] Späh [coord]592|574[/coord] --> Ankunftszeit: 05.04.24 13:22:50:426 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]619|577[/coord] --> Ankunftszeit: 05.04.24 14:21:12:330 [player]sKiLeRiX[/player]

components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('freundschaft').setLabel('Freundschaft').setStyle(ButtonStyle.Primary).setEmoji('🏳️'))],

[b]Dorf:[/b] [coord]501|500[/coord]
[b]Wallstufe:[/b] 8
[b]Zustimmung:[/b] 1

[b]Verteidiger:[/b]  0  0  0  0  0  0  0  0  0  0  0 

    [command]attack_small[/command] [command]snob[/command] [command]spy[/command] Späh [coord]497|401[/coord] --> Ankunftszeit: 06.04.24 11:38:09:103 [player]TheGreatButcher[/player]
    [command]attack_small[/command] [command]snob[/command] [command]spy[/command] Späh [coord]515|402[/coord] --> Ankunftszeit: 05.04.24 12:33:08:363 [player]TheGreatButcher[/player]
    [command]attack[/command] Späh [coord]594|571[/coord] --> Ankunftszeit: 05.04.24 13:22:42:537 [player]sKiLeRiX[/player]
    [command]attack[/command] Späh [coord]592|574[/coord] --> Ankunftszeit: 05.04.24 13:22:50:426 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]619|577[/coord] --> Ankunftszeit: 05.04.24 14:21:12:330 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]604|574[/coord] --> Ankunftszeit: 05.04.24 14:21:22:360 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]511|424[/coord] --> Ankunftszeit: 05.04.24 14:26:18:643 [player]Barmbeker85[/player]
    [command]attack[/command] Axt [coord]516|398[/coord] --> Ankunftszeit: 05.04.24 14:32:19:002 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]526|440[/coord] --> Ankunftszeit: 05.04.24 14:32:40:686 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]505|432[/coord] --> Ankunftszeit: 05.04.24 14:32:57:464 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]527|431[/coord] --> Ankunftszeit: 05.04.24 14:33:13:782 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]556|541[/coord] --> Ankunftszeit: 05.04.24 14:34:41:444 [player]Gyrosteller ohne Salat[/player]
    [command]attack[/command] Axt [coord]596|571[/coord] --> Ankunftszeit: 05.04.24 14:51:41:474 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]601|574[/coord] --> Ankunftszeit: 05.04.24 14:57:34:633 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]595|575[/coord] --> Ankunftszeit: 05.04.24 14:57:34:694 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]601|574[/coord] --> Ankunftszeit: 05.04.24 14:57:34:764 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]594|571[/coord] --> Ankunftszeit: 05.04.24 15:14:11:260 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]592|576[/coord] --> Ankunftszeit: 05.04.24 15:14:18:096 [player]sKiLeRiX[/player]
    [command]attack[/command] Axt [coord]589|434[/coord] --> Ankunftszeit: 05.04.24 15:26:03:782 [player]Barmbeker85[/player]
    [command]attack[/command] Axt [coord]598|503[/coord] --> Ankunftszeit: 05.04.24 15:29:05:015 [player]UNICRON[/player]
    [command]attack[/command] Axt [coord]521|432[/coord] --> Ankunftszeit: 05.04.24 15:32:25:923 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]525|441[/coord] --> Ankunftszeit: 05.04.24 15:32:31:036 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]505|432[/coord] --> Ankunftszeit: 05.04.24 15:32:52:837 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Axt [coord]531|439[/coord] --> Ankunftszeit: 05.04.24 15:33:08:716 [player]Nimsy van Hinden[/player]
    [command]attack[/command] Schwert [coord]589|551[/coord] --> Ankunftszeit: 05.04.24 16:09:58:919 [player]8Biervor4[/player]
    [command]attack[/command] Ramme [coord]594|571[/coord] --> Ankunftszeit: 05.04.24 17:13:03:325 [player]sKiLeRiX[/player]
    [command]attack[/command] Ramme [coord]597|572[/coord] --> Ankunftszeit: 05.04.24 17:13:20:245 [player]sKiLeRiX[/player]
    [command]attack[/command] Ramme [coord]574|480[/coord] --> Ankunftszeit: 05.04.24 17:24:00:734 [player]GxSturmi[/player]
    [command]attack[/command] Ramme [coord]575|479[/coord] --> Ankunftszeit: 05.04.24 17:24:15:086 [player]GxSturmi[/player]

*/
