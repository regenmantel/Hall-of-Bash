const puppeteer = require('puppeteer');
const request = require('request');

const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const { inlineCode } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	run: async (message, client) => {
		let tableName, channel;
		let skrMember = [];
		if (message.guild.id === config.server.serverId) {
			tableName = 'de221';
			channel = await client.channels.cache.get(config.server.channels.reportChannel);

			skrMember = [
				'Gol D. Roger',
				'xZaiZunx',
				'Phonix11',
				'The System is a Joke v2',
				'IchKlaueSATAnlagen',
				'UndercoverFlipper',
				'FlowerPower*',
				'Agent100',
				'Tinki1',
				'Nezuko',
				'Son Goku',
				'matz66',
				'Schleiferano',
				'steinschlag',
				'WirDeffenDichWegAG',
				'-=Sethos=-',
				'STAVKA',
				'MaLuS1337',
				'Kataquak',
				'HarryOtter',
				'GAL1LEO',
				'Sourex',
				'HausaufgabenGemacht?',
				'ahjoo',
				'Ichabessen',
				'FaaMaZe RONSTA',
				'Element',
				'klaaaaa',
				'Unfähig und Faul',
				'catonbook',
				'RamBam',
				'Anbauerregelt',
				'Schlumpfinchen',
				'DjangoLegend',
				'the real torbas',
				'Khaxzl',
				'rUl0rd',
				'Nils2002',
				'aiwa5',
				'Nachttürmer',
				'Dr. Gint0nic',
				'OttervonBismarck',
				'SKAV Maracuja',
				'Fieser Fiesling',
				'Weißwurst Chris',
				'Pandoralight',
				'BlAcKrOxX999',
				'puma 97',
				'kaioshin',
				'Morgar',
				'dodo1901',
				'Buffetminister',
				'Fapuuuu',
				'amrita',
				'Rexxter',
				'Honos',
				'xploe',
			];
		} else if (message.guild.id === config.server2.serverId) {
			tableName = 'de225';
			channel = await client.channels.cache.get(config.server2.channels.reportChannel);

			skrMember = [
				'cocodecoc',
				'kaioshin',
				'dodo1901',
				'TheGreatButcher',
				'FortnHuntr',
				'Gol D. Roger',
				'IchKlaueSATAnlagen',
				'FlowerPower*',
				'marcel1912',
				'SickL3gacy',
				'matz66',
				'Nezuko',
				'Melampous',
				'The System is a Joke v2',
				'MaLuS1337',
				'SurPr1z3',
				'DörferRecyclingGmbH',
				'WirDeffenDichWegAG',
				'schlartzi',
				'error.',
				'DjangoLegend',
				'UndercoverFlipper',
				'FaaMaZe RONSTA',
				'Oanza',
				'Hamburgbaaanq',
				'Yirooy',
				'Nils2002',
				'xZaiZunx',
				'Unfähig und Faul',
				'Rexxter',
			];
		} else {
			await interaction.reply({ content: 'Ungültiger Server', ephemeral: true });
			return;
		}

		if (!message.author.bot && message.content.startsWith(`https://${tableName}`) && message.channel === channel) {
			let link = message.content;
			let linkRegex = /https:\/\/(?<world>\w+\d+).+public_report\/(?<reportID>.+)/g;

			let timeRegex = /K.*\s+(?<day>\d+).(?<month>\d+).(?<year>\d+)\s+(?<hour>\d+):(?<minute>\d+):(?<second>\d+)/g;
			let luckData = /Angreiferglück\s+(?<glueck>[^%]*)%/g;
			let moralData = /Moral\:\s+(?<moral>\d+)/g;
			let attData = /Angreifer:\s+(?<attackerName>.*?)(\s+)Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)/g;
			let attackerUnitRegex =
				/Angreifer:\s+(?<attackerName>.*)\s+Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)\s+Anzahl:\s+(?<anzahlSpeerAngreifer>\d+)\s+(?<anzahlSchwertAngreifer>\d+)\s+(?<anzahlAxtAngreifer>\d+)\s+(?<anzahlBogenAngreifer>\d+)\s+(?<anzahlSpyAngreifer>\d+)\s+(?<anzahlLeichteAngreifer>\d+)\s+(?<anzahlBeritteneAngreifer>\d+)\s+(?<anzahlSchwereAngreifer>\d+)\s+(?<anzahlRammeAngreifer>\d+)\s+(?<anzahlKatapultAngreifer>\d+)\s+(?<anzahlPalaAngreifer>\d+)\s+(?<anzahlAGsAngreifer>\d+)/g;
			//let dataRegex = /Angreiferglück\s+(?<glueck>[^%]*)%\s+Moral\:\s+(?<moral>\d+)%\s+\S+\s+(?<attackerName>\w+)\s+Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)/g;
			//let regexVerteidiger = /Verteidiger\:\s+(?<defenderName>.*)\s+Ziel\:\s+(?<defenderVillageName>[^(]*)\((?<defenderXCoord>\d+)\D(?<defenderYCoord>\d+)\)\sK(?<defenderContinent>\d+)\s+Anzahl\:\s+(?<anzahlSpeerVerteidiger>\d+)\s+(?<anzahlSchwertVerteidiger>\d+)\s+(?<anzahlAxtVerteidiger>\d+)\s+(?<anzahlBogenVerteidiger>\d+)\s+(?<anzahlSpyVerteidiger>\d+)\s+(?<anzahlLeichteVerteidiger>\d+)\s+(?<anzahlBeritteneVerteidiger>\d+)\s+(?<anzahlSchwereVerteidiger>\d+)\s+(?<anzahlRammbockVerteidiger>\d+)\s+(?<anzahlKatapultVerteidiger>\d+)\s+(?<anzahlPaladinVerteidiger>\d+)\s+(?<anzahlAGVerteidiger>\d+)\s+(?<anzahlMilizVerteidiger>\d+)\s+Verluste\:\s+(?<verlusteSpeerVerteidiger>\d+)\s+(?<verlusteSchwertVerteidiger>\d+)\s+(?<verlusteAxtVerteidiger>\d+)\s+(?<verlusteBogenVerteidiger>\d+)\s+(?<verlusteSpyVerteidiger>\d+)\s+(?<verlusteLeichteVerteidiger>\d+)\s+(?<verlusteBeritteneVerteidiger>\d+)\s+(?<verlusteSchwereVerteidiger>\d+)\s+(?<verlusteRammbockVerteidiger>\d+)\s+(?<verlusteKatapultVerteidiger>\d+)\s+(?<verlustePalaVerteidiger>\d+)\s+(?<verlusteAGVerteidiger>\d+)\s+(?<verlusteMilizVerteidiger>\d+)\s+/g;
			let defenderRegex = /Verteidiger\:\s+(?<defenderName>.*)\s+Ziel\:\s+(?<defenderVillageName>[^(]*)\((?<defenderXCoord>\d+)\D(?<defenderYCoord>\d+)\)\sK(?<defenderContinent>\d+)\s+/g;
			let defenderUnitRegex =
				/Anzahl\:\s+(?<anzahlSpeerVerteidiger>\d+)\s+(?<anzahlSchwertVerteidiger>\d+)\s+(?<anzahlAxtVerteidiger>\d+)\s+(?<anzahlBogenVerteidiger>\d+)\s+(?<anzahlSpyVerteidiger>\d+)\s+(?<anzahlLeichteVerteidiger>\d+)\s+(?<anzahlBeritteneVerteidiger>\d+)\s+(?<anzahlSchwereVerteidiger>\d+)\s+(?<anzahlRammbockVerteidiger>\d+)\s+(?<anzahlKatapultVerteidiger>\d+)\s+(?<anzahlPaladinVerteidiger>\d+)\s+(?<anzahlAGVerteidiger>\d+)\s+(?<anzahlMilizVerteidiger>\d+)\s+Verluste\:\s+(?<verlusteSpeerVerteidiger>\d+)\s+(?<verlusteSchwertVerteidiger>\d+)\s+(?<verlusteAxtVerteidiger>\d+)\s+(?<verlusteBogenVerteidiger>\d+)\s+(?<verlusteSpyVerteidiger>\d+)\s+(?<verlusteLeichteVerteidiger>\d+)\s+(?<verlusteBeritteneVerteidiger>\d+)\s+(?<verlusteSchwereVerteidiger>\d+)\s+(?<verlusteRammbockVerteidiger>\d+)\s+(?<verlusteKatapultVerteidiger>\d+)\s+(?<verlustePalaVerteidiger>\d+)\s+(?<verlusteAGVerteidiger>\d+)\s+(?<verlusteMilizVerteidiger>\d+)\s+/g;

			if (message.guild.id === config.server2.serverId) {
				defenderUnitRegex =
					/Anzahl\:\s+(?<anzahlSpeerVerteidiger>\d+)\s+(?<anzahlSchwertVerteidiger>\d+)\s+(?<anzahlAxtVerteidiger>\d+)\s+(?<anzahlSpyVerteidiger>\d+)\s+(?<anzahlLeichteVerteidiger>\d+)\s+(?<anzahlSchwereVerteidiger>\d+)\s+(?<anzahlRammbockVerteidiger>\d+)\s+(?<anzahlKatapultVerteidiger>\d+)\s+(?<anzahlPaladinVerteidiger>\d+)\s+(?<anzahlAGVerteidiger>\d+)\s+(?<anzahlMilizVerteidiger>\d+)\s+Verluste\:\s+(?<verlusteSpeerVerteidiger>\d+)\s+(?<verlusteSchwertVerteidiger>\d+)\s+(?<verlusteAxtVerteidiger>\d+)\s+(?<verlusteSpyVerteidiger>\d+)\s+(?<verlusteLeichteVerteidiger>\d+)\s+(?<verlusteSchwereVerteidiger>\d+)\s+(?<verlusteRammbockVerteidiger>\d+)\s+(?<verlusteKatapultVerteidiger>\d+)\s+(?<verlustePalaVerteidiger>\d+)\s+(?<verlusteAGVerteidiger>\d+)\s+(?<verlusteMilizVerteidiger>\d+)\s+/g;

				attackerUnitRegex = attackerUnitRegex =
					/Angreifer:\s+(?<attackerName>.*)\s+Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)\s+Anzahl:\s+(?<anzahlSpeerAngreifer>\d+)\s+(?<anzahlSchwertAngreifer>\d+)\s+(?<anzahlAxtAngreifer>\d+)\s+(?<anzahlSpyAngreifer>\d+)\s+(?<anzahlLeichteAngreifer>\d+)\s+(?<anzahlSchwereAngreifer>\d+)\s+(?<anzahlRammeAngreifer>\d+)\s+(?<anzahlKatapultAngreifer>\d+)\s+(?<anzahlPalaAngreifer>\d+)\s+(?<anzahlAGsAngreifer>\d+)/g;
			}

			let palaRegex = /(\d{1,3}(?:,\d{3})*)(?=\s*XP)/g;
			let ramRegex = /Schaden\s+durch\s+Rammböcke:\D+(?<ramOld>\d+)\D+(?<ramNew>\d+)/g;
			let kataRegex = /Schaden\s+durch\s+Katapultbeschuss:\D+(?<buildingOld>\d+)\D+(?<buildingNew>\d+)/g;
			console.log(link);

			if (link.match(linkRegex)) {
				let match, world, reportID;
				while ((match = linkRegex.exec(link))) {
					world = match.groups.world;
					reportID = match.groups.reportID;
				}

				request(message.content, async function (error, response, body) {
					let input = body;
					input = input.replaceAll(/<.*?>/g, ' ');
					input = input.replaceAll('\t', ' ');
					input = input.replaceAll('  ', ' ');
					input = input.replaceAll('\n\n', '\n');
					input = input.replaceAll('\n \n', '\n');

					let day, month, year, hour, minute, second;
					while ((matchTime = timeRegex.exec(input)) !== null) {
						day = matchTime.groups.day ? matchTime.groups.day : 0;
						month = matchTime.groups.month ? matchTime.groups.month : 0;
						year = matchTime.groups.year ? matchTime.groups.year : 0;
						hour = matchTime.groups.hour ? matchTime.groups.hour : 0;
						minute = matchTime.groups.minute ? matchTime.groups.minute : 0;
						second = matchTime.groups.second ? matchTime.groups.second : 0;
					}

					let luck = 0;
					while ((matchLuck = luckData.exec(input)) !== null) {
						luck = matchLuck.groups.glueck ? matchLuck.groups.glueck : 0;
					}

					let moral = 0;
					while ((matchMoral = moralData.exec(input)) !== null) {
						moral = matchMoral.groups.moral ? matchMoral.groups.moral : 0;
					}

					let matchAttacker, attackerVillageName, attackerXCoords, attackerYCoords, attackerContinent;
					let attackerName = '';
					while ((matchAttacker = attData.exec(input)) !== null) {
						attackerName = matchAttacker.groups.attackerName ? matchAttacker.groups.attackerName : 'Angreifername';
						attackerVillageName = matchAttacker.groups.attackerVillageName ? matchAttacker.groups.attackerVillageName : 'Dorfname';
						attackerXCoords = matchAttacker.groups.attackerXCoord ? matchAttacker.groups.attackerXCoord : 0;
						attackerYCoords = matchAttacker.groups.attackerYCoord ? matchAttacker.groups.attackerYCoord : 0;
						attackerContinent = matchAttacker.groups.attackerContinent ? matchAttacker.groups.attackerContinent : 0;
					}

					let timestamp = new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`).getTime() / 1000;

					let matchDefender, defenderVillageName, defenderXCoords, defenderYCoords, defenderContinent;
					let defenderName = '';
					while ((matchDefender = defenderRegex.exec(input)) !== null) {
						defenderName = matchDefender.groups.defenderName ? matchDefender.groups.defenderName : 'Verteidigername';
						defenderVillageName = matchDefender.groups.defenderVillageName ? matchDefender.groups.defenderVillageName : 'Dorfname';
						defenderXCoords = matchDefender.groups.defenderXCoord ? matchDefender.groups.defenderXCoord : 0;
						defenderYCoords = matchDefender.groups.defenderYCoord ? matchDefender.groups.defenderYCoord : 0;
						defenderContinent = matchDefender.groups.defenderContinent ? matchDefender.groups.defenderContinent : 0;
					}

					let matchAngreifer, sFakeAmount;
					while ((matchAngreifer = attackerUnitRegex.exec(input)) !== null) {
						let angreiferSpeerAmount = matchAngreifer.groups.anzahlSpeerAngreifer ? matchAngreifer.groups.anzahlSpeerAngreifer : 0;
						let angreiferSchwertAmount = matchAngreifer.groups.anzahlSchwertAngreifer ? matchAngreifer.groups.anzahlSchwertAngreifer : 0;
						let angreiferAxtAmount = matchAngreifer.groups.anzahlAxtAngreifer ? matchAngreifer.groups.anzahlAxtAngreifer : 0;
						let angreiferSpyAmount = matchAngreifer.groups.anzahlSpyAngreifer ? matchAngreifer.groups.anzahlSpyAngreifer : 0;
						let angreiferLeichteAmount = matchAngreifer.groups.anzahlLeichteAngreifer ? matchAngreifer.groups.anzahlLeichteAngreifer : 0;
						let angreiferSchwereAmount = matchAngreifer.groups.anzahlSchwereAngreifer ? matchAngreifer.groups.anzahlSchwereAngreifer : 0;
						let angreiferRammeAmount = matchAngreifer.groups.anzahlRammeAngreifer ? matchAngreifer.groups.anzahlRammeAngreifer : 0;
						let angreiferKatapultAmount = matchAngreifer.groups.anzahlKatapultAngreifer ? matchAngreifer.groups.anzahlKatapultAngreifer : 0;
						let angreiferPalaAmount = matchAngreifer.groups.anzahlPalaAngreifer ? matchAngreifer.groups.anzahlPalaAngreifer : 0;
						let angreiferAGAmount = matchAngreifer.groups.anzahlAGsAngreifer ? matchAngreifer.groups.anzahlAGsAngreifer : 0;

						if (message.guild.id === config.server2.serverId) {
							sFakeAmount =
								parseInt(angreiferSpeerAmount) +
								parseInt(angreiferSchwertAmount) +
								parseInt(angreiferAxtAmount) +
								parseInt(angreiferSpyAmount) +
								parseInt(angreiferLeichteAmount) +
								parseInt(angreiferSchwereAmount) +
								parseInt(angreiferRammeAmount) +
								parseInt(angreiferKatapultAmount) +
								parseInt(angreiferPalaAmount) +
								parseInt(angreiferAGAmount);
						} else {
							let angreiferBogenAmount = matchAngreifer.groups.anzahlBogenAngreifer ? matchAngreifer.groups.anzahlBogenAngreifer : 0;
							let angreiferBeritteneAmount = matchAngreifer.groups.anzahlBeritteneAngreifer ? matchAngreifer.groups.anzahlBeritteneAngreifer : 0;
							sFakeAmount =
								parseInt(angreiferSpeerAmount) +
								parseInt(angreiferSchwertAmount) +
								parseInt(angreiferAxtAmount) +
								parseInt(angreiferBogenAmount) +
								parseInt(angreiferSpyAmount) +
								parseInt(angreiferLeichteAmount) +
								parseInt(angreiferBeritteneAmount) +
								parseInt(angreiferSchwereAmount) +
								parseInt(angreiferRammeAmount) +
								parseInt(angreiferKatapultAmount) +
								parseInt(angreiferPalaAmount) +
								parseInt(angreiferAGAmount);
						}
					}

					let matchVerteidiger, bashpoints;
					while ((matchVerteidiger = defenderUnitRegex.exec(input)) !== null) {
						let verlustSpeerVerteidiger = matchVerteidiger.groups.verlusteSpeerVerteidiger ? matchVerteidiger.groups.verlusteSpeerVerteidiger : 0;
						let verlustSchwertVerteidiger = matchVerteidiger.groups.verlusteSchwertVerteidiger ? matchVerteidiger.groups.verlusteSchwertVerteidiger : 0;
						let verlustAxtVerteidiger = matchVerteidiger.groups.verlusteAxtVerteidiger ? matchVerteidiger.groups.verlusteAxtVerteidiger : 0;
						let verlustSpyVerteidiger = matchVerteidiger.groups.verlusteSpyVerteidiger ? matchVerteidiger.groups.verlusteSpyVerteidiger : 0;
						let verlustLeichteVerteidiger = matchVerteidiger.groups.verlusteLeichteVerteidiger ? matchVerteidiger.groups.verlusteLeichteVerteidiger : 0;
						let verlustSchwereVerteidiger = matchVerteidiger.groups.verlusteSchwereVerteidiger ? matchVerteidiger.groups.verlusteSchwereVerteidiger : 0;
						let verlustRammbockVerteidiger = matchVerteidiger.groups.verlusteRammbockVerteidiger ? matchVerteidiger.groups.verlusteRammbockVerteidiger : 0;
						let verlustKatapultVerteidiger = matchVerteidiger.groups.verlusteKatapultVerteidiger ? matchVerteidiger.groups.verlusteKatapultVerteidiger : 0;
						let verlustPalaVerteidiger = matchVerteidiger.groups.verlustePalaVerteidiger ? matchVerteidiger.groups.verlustePalaVerteidiger : 0;
						let verlustAGVerteidiger = matchVerteidiger.groups.verlusteAGVerteidiger ? matchVerteidiger.groups.verlusteAGVerteidiger : 0;
						let verlustMilizVerteidiger = matchVerteidiger.groups.verlusteMilizVerteidiger ? matchVerteidiger.groups.verlusteMilizVerteidiger : 0;

						if (message.guild.id === config.server2.serverId) {
							bashpoints =
								parseInt(verlustSpeerVerteidiger * 4) +
								parseInt(verlustSchwertVerteidiger * 5) +
								parseInt(verlustAxtVerteidiger * 1) +
								parseInt(verlustSpyVerteidiger * 1) +
								parseInt(verlustLeichteVerteidiger * 5) +
								parseInt(verlustSchwereVerteidiger * 23) +
								parseInt(verlustRammbockVerteidiger * 4) +
								parseInt(verlustKatapultVerteidiger * 12) +
								parseInt(verlustPalaVerteidiger * 40) +
								parseInt(verlustAGVerteidiger * 200) +
								parseInt(verlustMilizVerteidiger * 4);
						} else {
							let verlustBogenVerteidiger = matchVerteidiger.groups.verlusteBogenVerteidiger ? matchVerteidiger.groups.verlusteBogenVerteidiger : 0;
							let verlustBeritteneVerteidiger = matchVerteidiger.groups.verlusteBeritteneVerteidiger ? matchVerteidiger.groups.verlusteBeritteneVerteidiger : 0;
							bashpoints =
								parseInt(verlustSpeerVerteidiger * 4) +
								parseInt(verlustSchwertVerteidiger * 5) +
								parseInt(verlustAxtVerteidiger * 1) +
								parseInt(verlustBogenVerteidiger * 5) +
								parseInt(verlustSpyVerteidiger * 1) +
								parseInt(verlustLeichteVerteidiger * 5) +
								parseInt(verlustBeritteneVerteidiger * 6) +
								parseInt(verlustSchwereVerteidiger * 23) +
								parseInt(verlustRammbockVerteidiger * 4) +
								parseInt(verlustKatapultVerteidiger * 12) +
								parseInt(verlustPalaVerteidiger * 40) +
								parseInt(verlustAGVerteidiger * 200) +
								parseInt(verlustMilizVerteidiger * 4);
						}
					}

					let palaXP;
					while ((match = palaRegex.exec(input)) !== null) {
						palaXP = match[1] ? match[1] : 0;
					}

					const browser = await puppeteer.launch({
						args: ['--no-sandbox', '--disabled-setupid-sandbox'],
						headless: 'new',
					});
					const page = await browser.newPage();

					await page.goto(link);

					const elementSelector = 'tr';
					const elementHandles = await page.$$(elementSelector);
					if (elementHandles.length === 0) {
						console.error('Der Berichtssektor konnte nicht gefunden werden.');
						await browser.close();
						return;
					}

					const boundingBox = await elementHandles[4].boundingBox();
					if (boundingBox) {
						const screenshotBuffer = await page.screenshot({
							clip: boundingBox,
						});

						await channel.send({ files: [screenshotBuffer] });
						await browser.close();
					}

					defenderName = defenderName.trim();

					if (!(attackerName === undefined || bashpoints === undefined) && skrMember.includes(attackerName)) {
						if (message.guild.id === config.server2.serverId) {
							if (attackerName != defenderName) {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${bashpoints} Bashis** gemacht.`);
								await conn(
									`INSERT INTO \`${tableName}\` (world, discordName, discordUserId, igAccountName, bashPoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
									[world, message.author.username, message.author.id, attackerName, bashpoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp],
								);
							} else {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${bashpoints} Bashis** gemacht, dieser Bericht wird nicht für die Hall of Bash gewertet. (${sFakeAmount})`);
							}
						} else {
							if (sFakeAmount <= 1000 && attackerName != defenderName) {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${bashpoints} Bashis** gemacht. (${sFakeAmount})`);
								await conn(
									`INSERT INTO \`${tableName}\` (world, discordName, discordUserId, igAccountName, bashPoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
									[world, message.author.username, message.author.id, attackerName, bashpoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp],
								);
							} else {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${bashpoints} Bashis** gemacht, dieser Bericht wird nicht für die Hall of Bash gewertet. (${sFakeAmount})`);
							}
						}
					} else if (bashpoints === undefined && palaXP !== undefined && skrMember.includes(attackerName)) {
						let palaXPBash = palaXP.replace(/,/g, '') / 10;

						if (message.guild.id === config.server2.serverId) {
							if (attackerName != defenderName) {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${palaXPBash} Bashis** gemacht.`);
								await conn(
									`INSERT INTO \`${tableName}\` (world, discordName, discordUserId, igAccountName, bashPoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
									[world, message.author.username, message.author.id, attackerName, parseInt(palaXPBash), luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp],
								);
							} else {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${palaXPBash} Bashis** gemacht, dieser Bericht wird nicht für die Hall of Bash gewertet. (${sFakeAmount})`);
							}
						} else {
							if (sFakeAmount <= 1000 && attackerName != defenderName) {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${palaXPBash} Bashis** gemacht. (${sFakeAmount})`);
								await conn(
									`INSERT INTO \`${tableName}\` (world, discordName, discordUserId, igAccountName, bashPoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
									[world, message.author.username, message.author.id, attackerName, parseInt(palaXPBash), luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp],
								);
							} else {
								await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${palaXPBash} Bashis** gemacht, dieser Bericht wird nicht für die Hall of Bash gewertet. (${sFakeAmount})`);
							}
						}
					} else {
						await channel.send(`${message.author}, dieser Bericht wird nicht für die Hall of Bash gewertet.`);
					}
				});
			}
		}
	},
};
