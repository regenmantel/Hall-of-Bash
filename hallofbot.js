(async () => {
    const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
    const credentialManager = require("./HallOfBash/Src/Credentials/Config");
    const dirPath = __dirname + '/HallOfBash';
    const { messageCommandsManager, eventsManager, buttonManager, selectMenuManager, modalFormsManager, slashCommandsManager } = require("./HallOfBash/Src/Structures/Managers/Export");

    const botClient = new Client({
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
        partials: [Partials.Channel]
    });

    exports.rootPath = dirPath;
    exports.client = botClient;

    botClient.messageCommands = new Collection();
    botClient.messageCommandsAliases = new Collection();
    botClient.events = new Collection();
    botClient.buttonCommands = new Collection();
    botClient.selectMenus = new Collection();
    botClient.modalForms = new Collection();
    botClient.slashCommands = new Collection();

    await messageCommandsManager(botClient, dirPath);
    await eventsManager(botClient, dirPath);
    await buttonManager(botClient, dirPath);
    await selectMenuManager(botClient, dirPath);
    await modalFormsManager(botClient, dirPath);
    await botClient.login(credentialManager.client.botToken);
    await slashCommandsManager(botClient, dirPath);
})();