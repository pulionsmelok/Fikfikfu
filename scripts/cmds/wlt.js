const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

config.whiteListModeThread = config.whiteListModeThread || {};
config.whiteListModeThread.whiteListThreadIds =
	(config.whiteListModeThread.whiteListThreadIds || []).map(String);

config.whiteListMode = config.whiteListMode || {};
config.whiteListMode.whiteListIds =
	(config.whiteListMode.whiteListIds || []).map(String);

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
			en: "Add, remove, edit user and thread whitelist",
			bn: "User এবং thread whitelist add, remove ও edit করুন"
		},

		category: "owner",

		guide: {
			en:
				"   {pn} [add | -a | +] [<uid>]: Add user to whitelist"
				+ "\n   {pn} [add | -a | +]: Add replied user or current thread"
				+ "\n   {pn} [remove | rm | -r | -] [<uid>]: Remove user"
				+ "\n   {pn} [remove | rm | -r | -]: Remove replied user or current thread"
				+ "\n   {pn} [list | -l]: Show whitelist"
				+ "\n   {pn} [on | off]: Turn whitelist mode on/off"
				+ "\n   {pn} [mode | -m] <on|off>: Turn whitelist mode on/off"
				+ "\n   {pn} [mode | -m] noti <on|off>: Notification on/off",

			bn:
				"   {pn} [যোগ | -a | +] [<uid>]: User whitelist এ add করুন"
				+ "\n   {pn} [যোগ | -a | +]: Reply করা user অথবা current thread add করুন"
				+ "\n   {pn} [অপসারণ | rm | -r | -] [<uid>]: User remove করুন"
				+ "\n   {pn} [অপসারণ | rm | -r | -]: Reply করা user অথবা current thread remove করুন"
				+ "\n   {pn} [তালিকা | -l]: Whitelist দেখুন"
				+ "\n   {pn} [on | off]: Whitelist mode চালু/বন্ধ করুন"
				+ "\n   {pn} [মোড | -m] <on|off>: Whitelist mode চালু/বন্ধ করুন"
				+ "\n   {pn} [মোড | -m] noti <on|off>: Notification চালু/বন্ধ করুন"
		}
	},

	langs: {
		en: {
			userAdded:
				"╭─✦✅ | 𝚄𝚂𝙴𝚁 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			userAlready:
				"╭─✦⚠️ | 𝚄𝚂𝙴𝚁 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳\n"
				+ "╰‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1",

			userRemoved:
				"╭─✦✅ | 𝚄𝚂𝙴𝚁 𝚁𝙴𝙼𝙾𝚅𝙴𝙳\n"
				+ "├‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚁𝙴𝙼𝙾𝚅𝙴𝙳",

			userNotFound:
				"╭─✦⚠️ | 𝚄𝚂𝙴𝚁 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳\n"
				+ "╰‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1",

			threadAdded:
				"╭─✦✅ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: %1\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %2\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			threadAlready:
				"╭─✦⚠️ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			threadRemoved:
				"╭─✦✅ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝚁𝙴𝙼𝙾𝚅𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚁𝙴𝙼𝙾𝚅𝙴𝙳",

			threadNotFound:
				"╭─✦⚠️ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳\n"
				+ "╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1",

			modeOn:
				"╭─✦✅ | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃 𝙼𝙾𝙳𝙴\n"
				+ "├‣ 𝙼𝙾𝙳𝙴: 𝙾𝙽\n"
				+ "╰‣ 𝙾𝙽𝙻𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳 𝚄𝚂𝙴𝚁𝚂/𝚃𝙷𝚁𝙴𝙰𝙳𝚂 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙱𝙾𝚃",

			modeOff:
				"╭─✦❎ | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃 𝙼𝙾𝙳𝙴\n"
				+ "├‣ 𝙼𝙾𝙳𝙴: 𝙾𝙵𝙵\n"
				+ "╰‣ 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙱𝙾𝚃",

			notiOn:
				"╭─✦✅ | 𝙽𝙾𝚃𝙸𝙵𝙸𝙲𝙰𝚃𝙸𝙾𝙽\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙽",

			notiOff:
				"╭─✦❎ | 𝙽𝙾𝚃𝙸𝙵𝙸𝙲𝙰𝚃𝙸𝙾𝙽\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙵𝙵"
		},

		bn: {
			userAdded:
				"╭─✦✅ | 𝚄𝚂𝙴𝚁 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			userAlready:
				"╭─✦⚠️ | 𝚄𝚂𝙴𝚁 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳\n"
				+ "╰‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1",

			userRemoved:
				"╭─✦✅ | 𝚄𝚂𝙴𝚁 𝚁𝙴𝙼𝙾𝚅𝙴𝙳\n"
				+ "├‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚁𝙴𝙼𝙾𝚅𝙴𝙳",

			userNotFound:
				"╭─✦⚠️ | 𝚄𝚂𝙴𝚁 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳\n"
				+ "╰‣ 𝚄𝚂𝙴𝚁 𝙸𝙳: %1",

			threadAdded:
				"╭─✦✅ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: %1\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %2\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			threadAlready:
				"╭─✦⚠️ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙰𝙳𝙳𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳",

			threadRemoved:
				"╭─✦✅ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝚁𝙴𝙼𝙾𝚅𝙴𝙳\n"
				+ "├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝚁𝙴𝙼𝙾𝚅𝙴𝙳",

			threadNotFound:
				"╭─✦⚠️ | 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳\n"
				+ "╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: %1",

			modeOn:
				"╭─✦✅ | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃 𝙼𝙾𝙳𝙴\n"
				+ "├‣ 𝙼𝙾𝙳𝙴: 𝙾𝙽\n"
				+ "╰‣ 𝙾𝙽𝙻𝚈 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃𝙴𝙳 𝚄𝚂𝙴𝚁𝚂/𝚃𝙷𝚁𝙴𝙰𝙳𝚂 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙱𝙾𝚃",

			modeOff:
				"╭─✦❎ | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃 𝙼𝙾𝙳𝙴\n"
				+ "├‣ 𝙼𝙾𝙳𝙴: 𝙾𝙵𝙵\n"
				+ "╰‣ 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙱𝙾𝚃",

			notiOn:
				"╭─✦✅ | 𝙽𝙾𝚃𝙸𝙵𝙸𝙲𝙰𝚃𝙸𝙾𝙽\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙽",

			notiOff:
				"╭─✦❎ | 𝙽𝙾𝚃𝙸𝙵𝙸𝙲𝙰𝚃𝙸𝙾𝙽\n"
				+ "╰‣ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙵𝙵"
		}
	},

	onStart: async function ({
		message,
		args,
		event,
		getLang,
		api,
		threadID
	}) {
		const action = String(args[0] || "").toLowerCase();

		config.whiteListMode.whiteListIds =
			(config.whiteListMode.whiteListIds || []).map(String);

		config.whiteListModeThread.whiteListThreadIds =
			(config.whiteListModeThread.whiteListThreadIds || []).map(String);

		const saveConfig = () =>
			writeFileSync(
				client.dirConfig,
				JSON.stringify(config, null, 2)
			);

		const replyUserID = event.messageReply?.senderID
			? String(event.messageReply.senderID)
			: null;

		switch (action) {
			case "add":
			case "-a":
			case "+": {

				if (replyUserID) {
					if (
						config.whiteListMode.whiteListIds.includes(
							replyUserID
						)
					) {
						return message.reply(
							getLang("userAlready", replyUserID)
						);
					}

					config.whiteListMode.whiteListIds.push(replyUserID);
					saveConfig();

					return message.reply(
						getLang("userAdded", replyUserID)
					);
				}

				const uid = String(args[1] || "").trim();

				if (uid && /^\d+$/.test(uid)) {
					if (
						config.whiteListMode.whiteListIds.includes(uid)
					) {
						return message.reply(
							getLang("userAlready", uid)
						);
					}

					config.whiteListMode.whiteListIds.push(uid);
					saveConfig();

					return message.reply(
						getLang("userAdded", uid)
					);
				}

				const tid = String(
					event.threadID || threadID || ""
				).trim();

				if (!tid) {
					return message.reply(
						"╭─✦⚠️ | 𝙴𝚁𝚁𝙾𝚁\n"
						+ "╰‣ 𝙲𝙾𝚄𝙻𝙳 𝙽𝙾𝚃 𝙳𝙴𝚃𝙴𝚁𝙼𝙸𝙽𝙴 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳"
					);
				}

				if (
					config.whiteListModeThread.whiteListThreadIds.includes(
						tid
					)
				) {
					return message.reply(
						getLang("threadAlready", tid)
					);
				}

				config.whiteListModeThread.whiteListThreadIds.push(tid);
				saveConfig();

				let threadName = "Current group/thread";

				try {
					const info = await api.getThreadInfo(tid);
					threadName =
						info?.threadName || threadName;
				} catch (_) {}

				return message.reply(
					getLang("threadAdded", threadName, tid)
				);
			}

			case "remove":
			case "rm":
			case "-r":
			case "-": {

				if (replyUserID) {
					const i =
						config.whiteListMode.whiteListIds.indexOf(
							replyUserID
						);

					if (i === -1) {
						return message.reply(
							getLang("userNotFound", replyUserID)
						);
					}

					config.whiteListMode.whiteListIds.splice(i, 1);
					saveConfig();

					return message.reply(
						getLang("userRemoved", replyUserID)
					);
				}

				const uid = String(args[1] || "").trim();

				if (uid && /^\d+$/.test(uid)) {
					const i =
						config.whiteListMode.whiteListIds.indexOf(uid);

					if (i === -1) {
						return message.reply(
							getLang("userNotFound", uid)
						);
					}

					config.whiteListMode.whiteListIds.splice(i, 1);
					saveConfig();

					return message.reply(
						getLang("userRemoved", uid)
					);
				}

				const tid = String(
					event.threadID || threadID || ""
				).trim();

				const i =
					config.whiteListModeThread.whiteListThreadIds.indexOf(
						tid
					);

				if (i === -1) {
					return message.reply(
						getLang("threadNotFound", tid)
					);
				}

				config.whiteListModeThread.whiteListThreadIds.splice(
					i,
					1
				);

				saveConfig();

				return message.reply(
					getLang("threadRemoved", tid)
				);
			}

			case "list":
			case "-l": {

				const users =
					config.whiteListMode.whiteListIds;

				const threads =
					config.whiteListModeThread.whiteListThreadIds;

				let text =
					"╭─✦✨ | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃\n"
					+ `├‣ 𝙼𝙾𝙳𝙴: ${
						config.whiteListMode.enable === true
							? "𝙾𝙽"
							: "𝙾𝙵𝙵"
					}\n`
					+ `├‣ 𝚄𝚂𝙴𝚁𝚂: ${users.length}\n`;

				if (users.length) {
					text +=
						users
							.map(
								id =>
									`│  ├‣ 𝚄𝙸𝙳: ${id}`
							)
							.join("\n") + "\n";
				}

				text +=
					`├‣ 𝙶𝚁𝙾𝚄𝙿𝚂/𝚃𝙷𝚁𝙴𝙰𝙳𝚂: ${threads.length}\n`;

				if (threads.length) {
					const threadInfo =
						await Promise.all(
							threads.map(async id => {
								let name = "Unfetched";

								try {
									const info =
										await api.getThreadInfo(id);

									name =
										info?.threadName ||
										name;
								} catch (_) {}

								return { id, name };
							})
						);

					text +=
						threadInfo
							.map(
								({ id, name }) =>
									`│  ├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: ${name}\n`
									+ `│  ╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${id}`
							)
							.join("\n") + "\n";
				}

				return message.reply(
					text + "╰─✦"
				);
			}

			case "on":
			case "enable":
			case "mode":
			case "m":
			case "-m": {

				let value;

				if (
					action === "mode" ||
					action === "m" ||
					action === "-m"
				) {
					value = String(
						args[1] || ""
					).toLowerCase();
				} else {
					value = action;
				}

				if (value === "noti") {

					const n =
						String(
							args[2] || ""
						).toLowerCase();

					if (
						n !== "on" &&
						n !== "off"
					) {
						return message.reply(
							"╭─✦⚠️ | 𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙾𝙿𝚃𝙸𝙾𝙽\n"
							+ "╰‣ 𝚄𝚂𝙴: /wlt mode noti on/off"
						);
					}

					config.hideNotiMessage =
						config.hideNotiMessage || {};

					config.hideNotiMessage.whiteListModeThread =
						n !== "on";

					saveConfig();

					return message.reply(
						getLang(
							n === "on"
								? "notiOn"
								: "notiOff"
						)
					);
				}

				if (value === "on") {

					config.whiteListMode.enable = true;
					config.whiteListModeThread.enable = true;

					saveConfig();

					return message.reply(
						getLang("modeOn")
					);
				}

				if (value === "off") {

					config.whiteListMode.enable = false;
					config.whiteListModeThread.enable = false;

					saveConfig();

					return message.reply(
						getLang("modeOff")
					);
				}

				return message.reply(
					"╭─✦⚠️ | 𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙼𝙾𝙳𝙴\n"
					+ "├‣ /wlt on\n"
					+ "├‣ /wlt off\n"
					+ "╰‣ /wlt mode noti on/off"
				);
			}

			default:
				return message.reply(
					"╭─✦📌 | 𝚆𝙷𝙸𝚃𝙴𝙻𝙸𝚂𝚃 𝙷𝙴𝙻𝙿\n"
					+ "├‣ /wlt add <UID>\n"
					+ "├‣ /wlt remove <UID>\n"
					+ "├‣ Reply + /wlt add\n"
					+ "├‣ Reply + /wlt remove\n"
					+ "├‣ /wlt add  → Current thread\n"
					+ "├‣ /wlt remove → Current thread\n"
					+ "├‣ /wlt list\n"
					+ "├‣ /wlt on\n"
					+ "├‣ /wlt off\n"
					+ "╰‣ /wlt mode noti on/off"
				);
		}
	}
};
