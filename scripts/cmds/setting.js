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

function getAdminIds() {
	const c = global.GoatBot?.config || {};
	const l = c.adminBot || c.adminUID || [];
	return (Array.isArray(l) ? l : [l]).filter(Boolean).map(String);
}

module.exports = {
	config: {
        name: "setting",
        aliases: ["settings", "botsetting"],
        version: "2.1-JSON",
        author: "SK-SIDDIK-KHAN",
        countDown: 3,
        role: 2,
        usePrefix: true,
        description: { en: "Bot settings panel (JSON)" },
        category: "owner",
        guide: { en: "{pn}\n{pn} prefix <new>\n{pn} adminonly on/off" },
    },
	onStart: async function ({ event, args, message, api }) {
		try {
			const uid = String(event.senderID || event.from?.id || "");
			if (!getAdminIds().includes(uid) && (global.GoatBot?.config?.adminBot || []).map(String).includes(uid) === false) {
			}
			const cfg = global.GoatBot.config;
			const sub = (args[0] || "").toLowerCase();
			const settings = await readJSON("bot_settings.json", {});

			if (sub === "prefix" && args[1]) {
				cfg.prefix = args[1];
				try {
					await fs.writeJson(global.client.dirConfig, cfg, { spaces: 2 });
				} catch {}
				return message.reply("✅ Prefix set: " + args[1]);
			}
			if (sub === "adminonly") {
				const v = (args[1] || "").toLowerCase();
				if (v === "on" || v === "off") {
					if (!cfg.adminOnly) cfg.adminOnly = {};
					cfg.adminOnly.enable = v === "on";
					try { await fs.writeJson(global.client.dirConfig, cfg, { spaces: 2 }); } catch {}
					return message.reply("adminOnly: " + v);
				}
			}
			if (sub === "save") {
				settings.savedAt = new Date().toISOString();
				settings.prefix = cfg.prefix;
				settings.adminOnly = cfg.adminOnly;
				await writeJSON("bot_settings.json", settings);
				return message.reply("✅ Settings snapshot saved (JSON)");
			}

			const users = global.db?.allUserData?.length || 0;
			const threads = global.db?.allThreadData?.length || 0;
			const txt =
`⚙️ BOT SETTINGS
━━━━━━━━━━━━
🔹 Prefix: ${cfg.prefix}
🔹 Language: ${cfg.language || "en"}
🔹 AdminOnly: ${cfg.adminOnly?.enable ? "ON" : "OFF"}
🔹 Users: ${users}
🔹 Threads: ${threads}
🔹 Admins: ${getAdminIds().length}
━━━━━━━━━━━━
• setting prefix !
• setting adminonly on/off
• setting save`;
			return message.reply(txt);
		} catch (e) {
			return message.reply("❌ Error: " + e.message);
		}
	}
};
