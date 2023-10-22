const { conn } = require('../../../functions/conn');
const axios = require('axios');
const config = require('../../../Credentials/Config');

module.exports = {
    name: "hallofbash",
    description: "Hall of Bash Top 3",
    onlyRoles: [config.server.roles.sf, config.server.roles.mod],
    run: async (client, interaction) => {
        let top = await conn('SELECT bashPoints, igAccountName FROM `hallofbash` ORDER by bashPoints DESC LIMIT 3;');
        
        for(let i=0; i<top.length; i++) {
            if(!top[i].bashPoints > 0) {
                top[i].igAccountName = ' ';
            }
        }
        
        let url = `https://diestaemmedb.de/testOsse/test.php?rang1=${top[0].igAccountName}&rang2=${top[1].igAccountName}&rang3=${top[2].igAccountName}&bash1=${top[0].bashPoints}&bash2=${top[1].bashPoints}&bash3=${top[2].bashPoints}`;
        console.log(url);

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