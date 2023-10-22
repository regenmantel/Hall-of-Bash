const { conn } = require('../../../functions/conn');
const axios = require('axios');
const config = require('../../../Credentials/Config');

module.exports = {
    name: "world",
    description: "Set world for Reports",
    onlyRoles: [config.server.roles.sf, config.server.roles.mod],
    options: [
        {
            name: "set",
            type: 4,
            description: "Welt auswählen",
            required: true
        }
    ],
    run: async (client, interaction) => {
        if (interaction.options.getInteger('set')) {
            config.server.world = interaction.options.getInteger('set');
            await interaction.reply({content: `Berichte werden nur noch akzeptiert von Welt ${config.server.world}.`, ephemeral: true});
        }
    }
}