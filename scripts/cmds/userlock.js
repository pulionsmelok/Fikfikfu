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
        name: "userlock",
        aliases: ["namewatch", "ulock"],
        version: "4.1-JSON",
        author: "SK-SIDDIK-KHAN",
        countDown: 2,
        role: 1,
        usePrefix: true,
        description: { en: "Detect name changes (JSON)" },
        category: "security",
        guide: { en: "{pn}\n{pn} on / off" },
    },
	onStart: async function ({ args, message }) {
		const input = (args[0] || "").toLowerCase();
		const settings = await readJSON("userlock_setting.json", { enabled: true });
		if (input === "on") {
			settings.enabled = true;
			await writeJSON("userlock_setting.json", settings);
			return message.reply("✅ UserLock Global ON (JSON)");
		}
		if (input === "off") {
			settings.enabled = false;
			await writeJSON("userlock_setting.json", settings);
			return message.reply("❌ UserLock Global OFF (JSON)");
		}
		const db = await readJSON("userlock.json", {});
		const total = Object.keys(db).length;
		return message.reply(
`╭─❖─〔 UserLock Panel 〕─❖─╮
│ Status: ${settings.enabled !== false ? "🟢 ON" : "🔴 OFF"}
│ 📊 Tracked Users: ${total}
│ 💾 JSON Storage
│ {pn} on / off
╰─❖─╯`.replace(/\{pn\}/g, "userlock")
		);
	},
	onChat: async function ({ event, message, api }) {
		try {
			const settings = await readJSON("userlock_setting.json", { enabled: true });
			if (settings.enabled === false) return;
			const uid = String(event.senderID || event.from?.id || "");
			if (!uid) return;
			const name = event.from
				? [event.from.first_name, event.from.last_name].filter(Boolean).join(" ")
				: null;
			const username = event.from?.username || null;
			if (!name && !username) return;
			const db = await readJSON("userlock.json", {});
			const prev = db[uid];
			const current = { name: name || prev?.current?.name || "Unknown", username: username || prev?.current?.username || null };
			if (!prev) {
				db[uid] = { current, history: [] };
				await writeJSON("userlock.json", db);
				return;
			}
			const changed = [];
			if (prev.current?.name && name && prev.current.name !== name) changed.push(`Name: ${prev.current.name} → ${name}`);
			if (prev.current?.username !== undefined && username && prev.current.username !== username) changed.push(`Username: @${prev.current.username || "none"} → @${username}`);
			if (changed.length) {
				const history = Array.isArray(prev.history) ? prev.history : [];
				history.push({ ...prev.current, at: new Date().toISOString() });
				db[uid] = { current, history: history.slice(-20) };
				await writeJSON("userlock.json", db);
				const chatId = String(event.threadID || event.chat?.id || "");
				if (chatId) {
					await message.reply(`🔔 Name/Username change\n👤 ${name || uid}\n${changed.join("\n")}`).catch(() => {});
				}
			} else {
				db[uid].current = current;
				await writeJSON("userlock.json", db);
			}
		} catch {}
	}
};
