const { sendHallOfBash } = require('../cronjobs/sendHallOfBash');
const { sendHallOfBash225 } = require('../cronjobs/sendHallOfBash225');
const { endMonth } = require('../cronjobs/endMonth');
const { endMonth225 } = require('../cronjobs/endMonth225');
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

			if (hour == '20' && minute == '02' && seconds == '00') {
				await sendHallOfBash(client);
			}

			if (hour == '20' && minute == '02' && seconds == '30') {
				await sendHallOfBash225(client);
			}
		}

		async function checkLastDayOfMonth(client) {
			const now = new Date();
			const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			let hour = now.getHours();
			let minute = now.getMinutes();
			let seconds = now.getSeconds();

			if (now.getDate() === lastDayOfMonth.getDate() && hour === 23 && minute === 50 && seconds === 0) {
				await endMonth(client);
			}

			if (now.getDate() === lastDayOfMonth.getDate() && hour === 23 && minute === 50 && seconds === 30) {
				await endMonth225(client);
			}
		}
	},
};
