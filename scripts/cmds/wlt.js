const { config } = global.GoatBot;
config.whiteListModeThread.whiteListThreadIds = (config.whiteListModeThread.whiteListThreadIds || []).map(String);
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
        name: "whitelistthread",
        aliases: ["wlt", "wt"],
        version: "1.5",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 2,
        usePrefix: true,
        description: {
        		en: "Add, remove, edit whiteListThreadIds role"
        	,
		bn: "Add, অপসারণ, edit whiteListThreadIds role"},
        category: "owner",
        guide: {
        		en: '   {pn} [add | -a | +] [<tid>...]: Add whiteListThreadIds role for the current thread or specified thread IDs'
        			+ '\n   {pn} [remove | -r | -] [<tid>...]: Remove whiteListThreadIds role from the current thread or specified thread IDs'
        			+ '\n   {pn} [list | -l]: List all whiteListThreadIds'
        			+ '\n   {pn} [mode | -m] <on|off>: Turn on/off whiteListThreadIds mode'
        			+ '\n   {pn} [mode | -m] noti <on|off>: Turn on/off notification for non-whiteListThreadIds'
        	,
		bn: '   {pn} [যোগ | -a | +] [<tid>...]: Add whiteListThreadIds role জন্য the বর্তমান thread অথবা specified thread IDs'
        			+ '\n   {pn} [অপসারণ | -r | -] [<tid>...]: Remove whiteListThreadIds role থেকে the বর্তমান thread অথবা specified thread IDs'
        			+ '\n   {pn} [তালিকা | -l]: তালিকা all whiteListThreadIds'
        			+ '\n   {pn} [মোড | -m] <on|off>: চালু করুন/off whiteListThreadIds মোড'
        			+ '\n   {pn} [মোড | -m] noti <on|off>: চালু করুন/off বিজ্ঞপ্তি জন্য non-whiteListThreadIds'},
    },

	langs: {
		en: {
			added: `\n╭─✦✅ | 𝙰𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			alreadyWLT: `╭✦⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍𝚜\n%2\n`,
			missingTIDAdd: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚊𝚍𝚍 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			removed: `\n╭✦✅ | 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			notAdded: `╭✦❎ | 𝙳𝚒𝚍𝚗'𝚝 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2\n`,
			missingTIDRemove: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			listWLTs: `╭✦✨ | 𝙻𝚒𝚜𝚝 𝚘𝚏 𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜\n%1\n╰‣ `,
			turnedOn: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOff: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOnNoti: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜",
			turnedOffNoti: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜"
		},
		bn: {
			added: `\n╭─✦✅ | 𝙰𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			alreadyWLT: `╭✦⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍𝚜\n%2\n`,
			missingTIDAdd: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚊𝚍𝚍 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			removed: `\n╭✦✅ | 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			notAdded: `╭✦❎ | 𝙳𝚒𝚍𝚗'𝚝 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2\n`,
			missingTIDRemove: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			listWLTs: `╭✦✨ | 𝙻𝚒𝚜𝚝 𝚘𝚏 𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜\n%1\n╰‣ `,
			turnedOn: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOff: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOnNoti: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜",
			turnedOffNoti: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜"
		
		}
	},

	onStart: async function ({ message, args, event, getLang, api, threadID }) {
		const action = String(args[0] || "").toLowerCase();
		config.whiteListMode.whiteListIds = (config.whiteListMode.whiteListIds || []).map(String);
		config.whiteListModeThread.whiteListThreadIds = (config.whiteListModeThread.whiteListThreadIds || []).map(String);
		const saveConfig = () => writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
		const replyUserID = event.messageReply?.senderID ? String(event.messageReply.senderID) : null;

		switch (action) {
			case "add": case "-a": case "+": {
				if (replyUserID) {
					if (config.whiteListMode.whiteListIds.includes(replyUserID)) return message.reply(`⚠️ User ${replyUserID} is already whitelisted.`);
					config.whiteListMode.whiteListIds.push(replyUserID); saveConfig();
					return message.reply(`✅ User ${replyUserID} has been added to whitelist.`);
				}
				const uid = String(args[1] || "").trim();
				if (uid && /^-?\d+$/.test(uid)) {
					if (config.whiteListMode.whiteListIds.includes(uid)) return message.reply(`⚠️ User ${uid} is already whitelisted.`);
					config.whiteListMode.whiteListIds.push(uid); saveConfig();
					return message.reply(`✅ User ${uid} has been added to whitelist.`);
				}
				const tid = String(event.threadID || threadID || "").trim();
				if (!tid) return message.reply("⚠️ Cannot determine current thread ID.");
				if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) return message.reply(`⚠️ This group/thread (${tid}) is already whitelisted.`);
				config.whiteListModeThread.whiteListThreadIds.push(tid); saveConfig();
				let threadName = "Current group/thread";
				try { const info = await api.getThreadInfo(tid); threadName = info?.threadName || threadName; } catch (_) {}
				return message.reply(`✅ Group/thread "${threadName}" (${tid}) has been added to whitelist.`);
			}

			case "remove": case "rm": case "-r": case "-": {
				if (replyUserID) {
					const i = config.whiteListMode.whiteListIds.indexOf(replyUserID);
					if (i === -1) return message.reply(`⚠️ User ${replyUserID} is not whitelisted.`);
					config.whiteListMode.whiteListIds.splice(i, 1); saveConfig();
					return message.reply(`✅ User ${replyUserID} has been removed from whitelist.`);
				}
				const uid = String(args[1] || "").trim();
				if (uid && /^-?\d+$/.test(uid)) {
					const i = config.whiteListMode.whiteListIds.indexOf(uid);
					if (i === -1) return message.reply(`⚠️ User ${uid} is not whitelisted.`);
					config.whiteListMode.whiteListIds.splice(i, 1); saveConfig();
					return message.reply(`✅ User ${uid} has been removed from whitelist.`);
				}
				const tid = String(event.threadID || threadID || "").trim();
				const i = config.whiteListModeThread.whiteListThreadIds.indexOf(tid);
				if (i === -1) return message.reply(`⚠️ This group/thread (${tid}) is not whitelisted.`);
				config.whiteListModeThread.whiteListThreadIds.splice(i, 1); saveConfig();
				return message.reply(`✅ Current group/thread (${tid}) has been removed from whitelist.`);
			}

			case "list": case "-l": {
				const users = config.whiteListMode.whiteListIds, threads = config.whiteListModeThread.whiteListThreadIds;
				let text = `╭─✦✨ WHITELIST\n├‣ Mode: ${config.whiteListMode.enable === true ? "ON" : "OFF"}\n├‣ Users: ${users.length}\n`;
				if (users.length) text += users.map(id => `│  ├‣ ${id}`).join("\n") + "\n";
				text += `├‣ Groups/Threads: ${threads.length}\n`;
				if (threads.length) text += threads.map(id => `│  ├‣ ${id}`).join("\n") + "\n";
				return message.reply(text + "╰‣");
			}

			case "on": case "enable": case "mode": case "m": case "-m": {
				let value = action === "mode" || action === "m" || action === "-m" ? String(args[1] || "").toLowerCase() : action;
				if (value === "on") {
					config.whiteListMode.enable = true; config.whiteListModeThread.enable = true; saveConfig();
					return message.reply("✅ Whitelist mode ON. Only whitelisted users/groups can use the bot. Bot admins can always use it.");
				}
				if (value === "off") {
					config.whiteListMode.enable = false; config.whiteListModeThread.enable = false; saveConfig();
					return message.reply("❎ Whitelist mode OFF. Everyone can use the bot.");
				}
				if (value === "noti") {
					const n = String(args[2] || "").toLowerCase();
					if (n !== "on" && n !== "off") return message.reply("⚠️ Use /wlt mode noti on or /wlt mode noti off.");
					config.hideNotiMessage.whiteListModeThread = n !== "on"; saveConfig();
					return message.reply(n === "on" ? getLang("turnedOnNoti") : getLang("turnedOffNoti"));
				}
				return message.reply("⚠️ Use /wlt on or /wlt off.");
			}
			default:
				return message.reply("Usage: /wlt on | /wlt off | /wlt add <UID> | /wlt remove <UID> | reply /wlt add/remove | /wlt add/remove (current group) | /wlt list");
		}
	}
};
