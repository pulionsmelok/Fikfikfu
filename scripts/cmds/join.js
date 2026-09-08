module.exports = {
	config: {
        name: "join",
        aliases: ["addme", "groupjoin"],
        version: "1.1-JSON",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 2,
        usePrefix: true,
        description: { en: "List groups / get invite info (JSON memory)" },
        category: "owner",
        guide: { en: "{pn} list\n{pn} <threadId>" },
    },
	onStart: async function ({ event, args, message, api }) {
		try {
			const allThreads = Array.isArray(global.db?.allThreadData) ? global.db.allThreadData : [];
			const groups = allThreads.filter(t => {
				const id = String(t.threadID || t.id || "");
				return t.isGroup === true || id.startsWith("-");
			});
			const sub = (args[0] || "").toLowerCase();
			if (!sub || sub === "list") {
				if (!groups.length) return message.reply("❌ কোনো গ্রুপ ডাটা নেই।");
				let txt = `📂 Groups (${groups.length})\n━━━━━━━━━━━━\n`;
				groups.slice(0, 40).forEach((g, i) => {
					txt += `${i + 1}. ${g.threadName || "Unknown"}\nID: ${g.threadID}\n`;
				});
				return message.reply(txt);
			}
			const tid = args[0];
			try {
				const info = await api.getChat?.(tid);
				const count = await api.getChatMemberCount?.(tid).catch(() => "?");
				return message.reply(
`📂 ${info?.title || "Group"}
🆔 ${tid}
👥 Members: ${count}
🔗 ${info?.username ? "https://t.me/" + info.username : "Private"}`
				);
			} catch (e) {
				return message.reply("❌ " + e.message);
			}
		} catch (e) {
			return message.reply("❌ Error: " + e.message);
		}
	}
};
