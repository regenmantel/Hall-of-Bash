const {
    inlineCode,
    Client,
    GatewayIntentBits,
    Partials,
    ChannelType,
    PermissionsBitField
} = require("discord.js");
const axios = require('axios');

const config = require("../Credentials/Config");
const {conn} = require("../functions/conn");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent, // Only for bots with message content intent access.
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.login(config.client.botToken);

client.on("ready", async () => {
    const hallOfBashChannel = client.channels.cache.find(channel => channel.id === config.server.channels.hobChannel);

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
    axios.get(url)
        .then(async response => {
            img = `https://diestaemmedb.de/testOsse/bashpoints.jpeg?timeunix=${Date.now()}`;
        })
        .catch(error => {
            console.error('Error while making the request:', error);
        });
    await delay(300);
    
    await hallOfBashChannel.send(img);

    await delay(30000); 
    process.exit();

});

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}