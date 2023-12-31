const puppeteer = require("puppeteer");
const request = require('request');

const config = require('../Credentials/Config');
const { conn } = require('../functions/conn');

const { inlineCode } = require("discord.js");

module.exports = {
    name: "messageCreate",
    run: async(message, client) => {
        const channel = await client.channels.cache.get(config.server.channels.reportChannel);

        if(!message.author.bot && message.content.startsWith(`https://de${config.server.world}`) && (message.channel === channel)) {
            let link = message.content;
            let linkRegex = /https:\/\/(?<world>\w+\d+).+public_report\/(?<reportID>.+)/g;

            let timeRegex = /K.*\s+(?<day>\d+).(?<month>\d+).(?<year>\d+)\s+(?<hour>\d+):(?<minute>\d+):(?<second>\d+)/g;
            let luckData = /Angreiferglück\s+(?<glueck>[^%]*)%/g;
            let moralData = /Moral\:\s+(?<moral>\d+)/g
            let attData = /Angreifer:\s+(?<attackerName>\w+)\s+Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)/g;
            //let dataRegex = /Angreiferglück\s+(?<glueck>[^%]*)%\s+Moral\:\s+(?<moral>\d+)%\s+\S+\s+(?<attackerName>\w+)\s+Herkunft\:\s+(?<attackerVillageName>[^(]*)\s\((?<attackerXCoord>\d+)\D(?<attackerYCoord>\d+)\)\sK(?<attackerContinent>\d+)/g;
            let regexVerteidiger = /Verteidiger\:\s+(?<defenderName>.*)\s+Ziel\:\s+(?<defenderVillageName>[^(]*)\((?<defenderXCoord>\d+)\D(?<defenderYCoord>\d+)\)\sK(?<defenderContinent>\d+)\s+Anzahl\:\s+(?<anzahlSpeerVerteidiger>\d+)\s+(?<anzahlSchwertVerteidiger>\d+)\s+(?<anzahlAxtVerteidiger>\d+)\s+(?<anzahlBogenVerteidiger>\d+)\s+(?<anzahlSpyVerteidiger>\d+)\s+(?<anzahlLeichteVerteidiger>\d+)\s+(?<anzahlBeritteneVerteidiger>\d+)\s+(?<anzahlSchwereVerteidiger>\d+)\s+(?<anzahlRammbockVerteidiger>\d+)\s+(?<anzahlKatapultVerteidiger>\d+)\s+(?<anzahlPaladinVerteidiger>\d+)\s+(?<anzahlAGVerteidiger>\d+)\s+(?<anzahlMilizVerteidiger>\d+)\s+Verluste\:\s+(?<verlusteSpeerVerteidiger>\d+)\s+(?<verlusteSchwertVerteidiger>\d+)\s+(?<verlusteAxtVerteidiger>\d+)\s+(?<verlusteBogenVerteidiger>\d+)\s+(?<verlusteSpyVerteidiger>\d+)\s+(?<verlusteLeichteVerteidiger>\d+)\s+(?<verlusteBeritteneVerteidiger>\d+)\s+(?<verlusteSchwereVerteidiger>\d+)\s+(?<verlusteRammbockVerteidiger>\d+)\s+(?<verlusteKatapultVerteidiger>\d+)\s+(?<verlustePalaVerteidiger>\d+)\s+(?<verlusteAGVerteidiger>\d+)\s+(?<verlusteMilizVerteidiger>\d+)\s+/g;
            console.log(link);
            if(link.match(linkRegex)) {
                let match, world, reportID;
                while (match = linkRegex.exec(link)) {
                    world = match.groups.world;
                    reportID = match.groups.reportID;
                }

                request(message.content, async function (error, response, body) {
                    let input = body;
                    input = input.replaceAll(/<.*?>/g, " ");
                    input = input.replaceAll('\t',' ');
                    input = input.replaceAll("  ", " ");
                    input = input.replaceAll("\n\n", "\n");
                    input = input.replaceAll("\n \n", "\n");

                    //console.log(input);

                    let day, month, year, hour, minute, second;
                    while ((matchTime = timeRegex.exec(input)) !== null) {
                        day = matchTime.groups.day ? matchTime.groups.day: 0;
                        month = matchTime.groups.month ? matchTime.groups.month: 0;
                        year = matchTime.groups.year ? matchTime.groups.year: 0;
                        hour = matchTime.groups.hour ? matchTime.groups.hour: 0;
                        minute = matchTime.groups.minute ? matchTime.groups.minute: 0;
                        second = matchTime.groups.second ? matchTime.groups.second: 0;
                    }

                    let luck = 0;
                    while ((matchLuck = luckData.exec(input)) !== null) {
                        luck = matchLuck.groups.glueck ? matchLuck.groups.glueck : 0;
                    }
                    let moral = 0;
                    while ((matchMoral = moralData.exec(input)) !== null) {
                        moral = matchMoral.groups.moral ? matchMoral.groups.moral : 0;
                    }
                    let matchAttacker, attackerName, attackerVillageName, attackerXCoords, attackerYCoords, attackerContinent;

                    while ((matchAttacker = attData.exec(input)) !== null) {
                        attackerName = matchAttacker.groups.attackerName ? matchAttacker.groups.attackerName: 'Angreifername';
                        attackerVillageName = matchAttacker.groups.attackerVillageName ? matchAttacker.groups.attackerVillageName: 'Dorfname';
                        attackerXCoords = matchAttacker.groups.attackerXCoord ? matchAttacker.groups.attackerXCoord: 0;
                        attackerYCoords = matchAttacker.groups.attackerYCoord ? matchAttacker.groups.attackerYCoord: 0;
                        attackerContinent = matchAttacker.groups.attackerContinent ?  matchAttacker.groups.attackerContinent: 0;
                    }
                    
                    let timestamp = new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`).getTime() / 1000;
                    
                    let matchVerteidiger, bashpoints, defenderName, defenderVillageName, defenderXCoords, defenderYCoords, defenderContinent;
                    while ((matchVerteidiger = regexVerteidiger.exec(input)) !== null) {
                        defenderName = matchVerteidiger.groups.defenderName ? matchVerteidiger.groups.defenderName: 'Verteidigername';
                        defenderVillageName = matchVerteidiger.groups.defenderVillageName ? matchVerteidiger.groups.defenderVillageName: 'Dorfname';
                        defenderXCoords = matchVerteidiger.groups.defenderXCoord ? matchVerteidiger.groups.defenderXCoord: 0;
                        defenderYCoords = matchVerteidiger.groups.defenderYCoord ? matchVerteidiger.groups.defenderYCoord: 0;
                        defenderContinent = matchVerteidiger.groups.defenderContinent ? matchVerteidiger.groups.defenderContinent: 0;
                        let verlustSpeerVerteidiger = matchVerteidiger.groups.verlusteSpeerVerteidiger ? matchVerteidiger.groups.verlusteSpeerVerteidiger: 0;
                        let verlustSchwertVerteidiger = matchVerteidiger.groups.verlusteSchwertVerteidiger ? matchVerteidiger.groups.verlusteSchwertVerteidiger: 0;
                        let verlustAxtVerteidiger = matchVerteidiger.groups.verlusteAxtVerteidiger ? matchVerteidiger.groups.verlusteAxtVerteidiger: 0;
                        let verlustBogenVerteidiger = matchVerteidiger.groups.verlusteBogenVerteidiger ? matchVerteidiger.groups.verlusteBogenVerteidiger: 0;
                        let verlustSpyVerteidiger = matchVerteidiger.groups.verlusteSpyVerteidiger ? matchVerteidiger.groups.verlusteSpyVerteidiger: 0;
                        let verlustLeichteVerteidiger = matchVerteidiger.groups.verlusteLeichteVerteidiger ? matchVerteidiger.groups.verlusteLeichteVerteidiger: 0;
                        let verlustBeritteneVerteidiger = matchVerteidiger.groups.verlusteBeritteneVerteidiger ? matchVerteidiger.groups.verlusteBeritteneVerteidiger: 0;
                        let verlustSchwereVerteidiger = matchVerteidiger.groups.verlusteSchwereVerteidiger ? matchVerteidiger.groups.verlusteSchwereVerteidiger: 0;
                        let verlustRammbockVerteidiger = matchVerteidiger.groups.verlusteRammbockVerteidiger ? matchVerteidiger.groups.verlusteRammbockVerteidiger: 0;
                        let verlustKatapultVerteidiger = matchVerteidiger.groups.verlusteKatapultVerteidiger ? matchVerteidiger.groups.verlusteKatapultVerteidiger: 0;
                        let verlustPalaVerteidiger = matchVerteidiger.groups.verlustePalaVerteidiger ? matchVerteidiger.groups.verlustePalaVerteidiger: 0;
                        let verlustAGVerteidiger = matchVerteidiger.groups.verlusteAGVerteidiger ? matchVerteidiger.groups.verlusteAGVerteidiger: 0;
                        let verlustMilizVerteidiger = matchVerteidiger.groups.verlusteMilizVerteidiger ? matchVerteidiger.groups.verlusteMilizVerteidiger: 0;
                            
                        /*  
                        console.log('Verteidiger:');
                        console.log(`Verluste: Spear: ${verlustSpeerVerteidiger}, Sword: ${verlustSchwertVerteidiger}, Axe: ${verlustAxtVerteidiger}, Bogen: ${verlustBogenVerteidiger}, Spy: ${verlustSpyVerteidiger}, Lkav: ${verlustLeichteVerteidiger}, Berittene: ${verlustBeritteneVerteidiger}, Schwere: ${verlustSchwereVerteidiger}, Ramme: ${verlustRammbockVerteidiger}, Kata: ${verlustKatapultVerteidiger}, Pala: ${verlustPalaVerteidiger}, AG: ${verlustAGVerteidiger}, Miliz: ${verlustMilizVerteidiger}`);
                        */
                        bashpoints = 
                            parseInt((verlustSpeerVerteidiger * 4)) + 
                            parseInt((verlustSchwertVerteidiger * 5)) + 
                            parseInt((verlustAxtVerteidiger*1)) + 
                            parseInt((verlustBogenVerteidiger*5)) + 
                            parseInt((verlustSpyVerteidiger*1)) + 
                            parseInt((verlustLeichteVerteidiger*5)) + 
                            parseInt((verlustBeritteneVerteidiger*6)) + 
                            parseInt((verlustSchwereVerteidiger*23)) + 
                            parseInt((verlustRammbockVerteidiger*4))+ 
                            parseInt((verlustKatapultVerteidiger*12)) + 
                            parseInt((verlustPalaVerteidiger*40)) + 
                            parseInt((verlustAGVerteidiger*200)) + 
                            parseInt((verlustMilizVerteidiger* 4))
    
                        //console.log(`Mit diesem Angriff hast du ${bashpoints} Bash-Punkte gemacht.`);
                    }

                    console.log(attackerName);
                    console.log(bashpoints);
                    console.log(luck);
                    console.log(moral);
                    console.log(attackerXCoords);
                    console.log(attackerYCoords);
                    console.log(defenderXCoords);
                    console.log(defenderYCoords);
                    console.log(timestamp);

                    if(!(attackerName === undefined || bashpoints === undefined)) {
                        const browser = await puppeteer.launch({
                            args: ["--no-sandbox", "--disabled-setupid-sandbox"],
                            headless: 'new'
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
        
                            await channel.send({files: [screenshotBuffer]});
                            await channel.send(`${message.author}, ${inlineCode(attackerName)} hat mit diesem Angriff **${bashpoints} Bashis** gemacht.`);
                            await conn('INSERT INTO `hallofbash` (world, discordName, discordUserId, igAccountName, bashPoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                    [world, message.author.username, message.author.id, attackerName, bashpoints, luck, moral, attackerXCoords, attackerYCoords, defenderXCoords, defenderYCoords, timestamp]);                   
                        }
    
                        await browser.close();
                    } else {
                        await message.delete();
                    }
                });
            }
        }
    }
}