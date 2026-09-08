module.exports = {
	config: {
        name: "setmenu",
        aliases: ["slashmenu", "botmenu"],
        version: "8.7-TELEGRAM",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 2,
        usePrefix: true,
        description: { en: "Set Telegram slash command menu" },
        category: "owner",
        guide: { en: "{pn} on\n{pn} off" },
    },
	onStart: async function ({ api, event, args, message }) {
		try {
			const input = (args[0] || "").toLowerCase();
			if (input !== "on" && input !== "off") {
				return message.reply("Usage:\nsetmenu on\nsetmenu off");
			}
			if (input === "off") {
				try {
					await api.deleteMyCommands?.({ scope: { type: "default" } });
					await api.deleteMyCommands?.();
				} catch {}
				return message.reply("🔴 SLASH MENU OFF");
			}
			const commands = [];
			const cmds = global.GoatBot?.commands;
			if (cmds) {
				for (const [, cmd] of cmds) {
					try {
						const name = String(cmd.config?.name || "").toLowerCase();
						if (!name || !/^[a-z][a-z0-9_]{1,31}$/.test(name)) continue;
						let desc = "";
						if (typeof cmd.config.description === "string") desc = cmd.config.description;
						else if (cmd.config.description?.en) desc = cmd.config.description.en;
						desc = String(desc).replace(/[\u0000-\u001F\u007F]/g, "").trim();
						if (!desc || desc.length < 3) desc = name + " command";
						if (desc.length > 250) desc = desc.slice(0, 250);
						commands.push({ command: name, description: desc });
					} catch {}
				}
			}
			const finalCmds = commands.slice(0, 90);
			if (!finalCmds.length) return message.reply("❌ No valid commands found");
			if (typeof api.setMyCommands === "function") {
				await api.setMyCommands(finalCmds);
				await api.setMyCommands?.(finalCmds, { scope: { type: "all_private_chats" } }).catch(() => {});
				await api.setMyCommands?.(finalCmds, { scope: { type: "all_group_chats" } }).catch(() => {});
			} else {
				return message.reply("❌ setMyCommands API নেই");
			}
			return message.reply(`✅ SLASH MENU ON\n🟢 ${finalCmds.length} commands set`);
		} catch (e) {
			return message.reply("❌ Error: " + e.message);
		}
	}
};
