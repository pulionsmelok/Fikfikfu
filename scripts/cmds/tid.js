module.exports = {
	config: {
        name: "tid",
        aliases: [],
        version: "1.2",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        usePrefix: true,
        description: {
        		vi: "Xem id nhóm chat của bạn",
        		en: "View threadID of your group chat"
        	},
        category: "info",
        guide: {
        		en: "{pn}"
        	},
    },

	onStart: async function ({ message, event }) {
		message.reply(event.threadID.toString());
	}
};