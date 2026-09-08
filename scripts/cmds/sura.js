const path = require("path");
const fs = require("fs");

function getAllSuraData() {
	let allData = [];
	const dirs = [
		path.join(__dirname, "S1DD1K"),
		path.join(__dirname, "S1DD1K"),
		path.join(__dirname, "S1DD1K")
	];
	for (let i = 1; i <= 10; i++) {
		for (const d of dirs) {
			const filePath = path.join(d, `quran${i}.json`);
			if (fs.existsSync(filePath)) {
				try {
					const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
					if (Array.isArray(data)) allData = allData.concat(data);
					else allData.push(data);
				} catch {}
			}
		}
	}
	allData.sort((a, b) => (a.number || 0) - (b.number || 0));
	return allData;
}

function buildSuraText(surah) {
	let msg = `╭─❏ 📖 সূরা: ${surah.name}\n`;
	const limit = Math.min(surah.arabic ? surah.arabic.length : 0, 5);
	for (let i = 0; i < limit; i++) {
		msg += `\n│ ✨ আয়াত ${i + 1}: ${surah.arabic?.[i] || ""}`;
		msg += `\n│ 🗣️ উচ্চারণ: ${surah.pronunciation?.[i] || ""}`;
		msg += `\n│ 💎 অর্থ: ${surah.meaning?.[i] || ""}\n`;
	}
	msg += `╰──────────────`;
	return msg;
}

module.exports = {
	config: {
        name: "sura",
        aliases: ["quran"],
        version: "3.1-JSON",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        usePrefix: true,
        description: { en: "Quran sura from JSON files" },
        category: "islamic",
        guide: { en: "{pn}\n{pn} <number>\n{pn} list" },
    },
	onStart: async function ({ api, event, args, message }) {
		const chatId = String(event.threadID || event.chat?.id || "");
		const quranData = getAllSuraData();
		if (!quranData.length) {
			return message.reply("❌ কোনো Quran JSON নেই!\n📁 scripts/cmds/data/quran/quran1.json ... রাখো");
		}
		const sub = (args[0] || "").toLowerCase();
		if (sub === "list") {
			let txt = `📖 Sura List (${quranData.length})\n━━━━━━━━━━━━\n`;
			quranData.slice(0, 50).forEach(s => { txt += `${s.number}. ${s.name}\n`; });
			return message.reply(txt);
		}
		if (sub && /^\d+$/.test(sub)) {
			const surah = quranData.find(s => String(s.number) === sub);
			if (!surah) return message.reply("❌ Sura পাওয়া যায়নি");
			return message.reply(buildSuraText(surah));
		}
		const surah = quranData[Math.floor(Math.random() * quranData.length)];
		return message.reply(buildSuraText(surah));
	}
};
