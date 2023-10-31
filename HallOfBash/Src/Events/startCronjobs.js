const { sendHallOfBash } = require('../cronjobs/sendHallOfBash');
const { endMonth } = require('../cronjobs/endMonth');
module.exports = {
	name: 'ready',
	runOnce: true,
	run: async (client) => {
		setInterval(() => {
			checkTime(client);
			checkLastDayOfMonth(client);
		}, 1000);

		async function checkTime(client) {
			let hour = new Date().getHours();
			let minute = new Date().getMinutes();
			let seconds = new Date().getSeconds();

			if (hour == '20' && minute == '00' && seconds == '00') {
				await sendHallOfBash(client);
			}
		}

		async function checkLastDayOfMonth(client) {
			const now = new Date();
			const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			if (now.getDate() === lastDayOfMonth.getDate() && now.getHours() === 23 && now.getMinutes() === 50 && now.getSeconds() === 0) {
				await endMonth(client);
			}
		}
	},
};
