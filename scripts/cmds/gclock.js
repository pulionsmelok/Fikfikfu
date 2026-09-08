const fs = require("fs-extra");
const path = require("path");
const JSON_DIR = path.join(__dirname, "S1DD1K");
async function readJSON(name, fallback = {}) {
	try {
		await fs.ensureDir(JSON_DIR);
		const p = path.join(JSON_DIR, name.endsWith(".json") ? name : name + ".json");
		await fs.ensureFile(p);
		const raw = await fs.readFile(p, "utf8");
		if (!raw.trim()) return fallback;
		return JSON.parse(raw);
	} catch { return fallback; }
}
async function writeJSON(name, data) {
	await fs.ensureDir(JSON_DIR);
	const p = path.join(JSON_DIR, name.endsWith(".json") ? name : name + ".json");
	await fs.writeJson(p, data, { spaces: 2 });
	return data;
}

module.exports = {
	config: {
        name: "gclock",
        aliases: ["grouplock", "lockgc"],
        version: "1.1-JSON",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 1,
        usePrefix: true,
        description: { en: "Lock/unlock group settings (JSON)" },
        category: "group",
        guide: { en: "{pn} on/off\n{pn} status" },
    },
	onStart: async function ({ event, args, message, api }) {
		const chatId = String(event.threadID || event.chat?.id || "");
		if (!chatId.startsWith("-") && event.isGroup !== true && !["group", "supergroup"].includes(event.chat?.type)) {
			return message.reply("❌ Only in groups");
		}
		const store = await readJSON("gclock.json", {});
		const sub = (args[0] || "").toLowerCase();
		if (sub === "on" || sub === "lock") {
			store[chatId] = { locked: true, at: new Date().toISOString() };
			await writeJSON("gclock.json", store);
			try {
				await api.setChatPermissions?.(chatId, {
					can_send_messages: false,
					can_send_media_messages: false,
					can_send_other_messages: false,
					can_add_web_page_previews: false
				});
			} catch (e) {
				return message.reply("✅ GC Lock saved (JSON)\n⚠️ Permission API: " + e.message);
			}
			return message.reply("🔒 Group locked (members cannot send)");
		}
		if (sub === "off" || sub === "unlock") {
			store[chatId] = { locked: false, at: new Date().toISOString() };
			await writeJSON("gclock.json", store);
			try {
				await api.setChatPermissions?.(chatId, {
					can_send_messages: true,
					can_send_media_messages: true,
					can_send_other_messages: true,
					can_add_web_page_previews: true
				});
			} catch (e) {
				return message.reply("✅ GC Unlock saved (JSON)\n⚠️ Permission API: " + e.message);
			}
			return message.reply("🔓 Group unlocked");
		}
		const st = store[chatId]?.locked ? "🔒 LOCKED" : "🔓 UNLOCKED";
		return message.reply(`Group Lock Status: ${st}\nUse: gclock on / off`);
	}
};
