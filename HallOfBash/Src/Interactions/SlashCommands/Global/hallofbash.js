const { conn } = require('../../../functions/conn');
const axios = require('axios');
const config = require('../../../Credentials/Config');

module.exports = {
    name: "hallofbash",
    description: "Hall of Bash Top 3",
    onlyRoles: [config.server.roles.sf, config.server.roles.mod],
    run: async (client, interaction) => {
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

        await interaction.reply({ content: img, ephemeral: true });
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}