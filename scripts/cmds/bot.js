const axios = require("axios");

let cachedApiUrl = null;

const getApiUrl = async () => {
	try {
		if (cachedApiUrl)
			return cachedApiUrl;

		const b = await axios.get(
			"https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json",
			{ timeout: 5000 }
		);

		cachedApiUrl = b.data.sim || "https://api.nayan-v1.repl.co";
		return cachedApiUrl;
	}
	catch {
		cachedApiUrl = "https://api.nayan-v1.repl.co";
		return cachedApiUrl;
	}
};

if (!global.GoatBot)
	global.GoatBot = {};

if (!global.GoatBot.onReply)
	global.GoatBot.onReply = new Map();

const RAND = [
	"🌸-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-🌸",
	"আমি এখন বস এসকে সিদ্দিক এর সাথে বিজি আছি আমাকে ডাকবেন না-😏 ধন্যবাদ-🤝🐒",
	"আমাকে না ডেকে আমার বস এসকে সিদ্দিক কে একটা জি এফ দাও-😽🫶🌺",
	"ঝাং থুমালে আইলাপিউ পেপি-💝😽",
	"উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
	"জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
	"আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
	"ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
	"চুনা ও চুনা আমার বস এসকে সিদ্দিক এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
	"স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
	"জান হাঙ্গা করবা-🙊😝🌻",
	"জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
	"ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
	"আমার বস এসকে সিদ্দিক এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶",
	"জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
	"বেশি Bot Bot করলে leave নিবো কিন্তু😒😒",
	"শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
	"আমি আবাল দের সাতে কথা বলি না,ok😒",
	"এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
	"Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋",
	"বার বার ডাকলে মাথা গরম হয় কিন্তু😑",
	"হা বলো😒,কি করতে পারি😐😑?",
	"এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬",
	"আরে Bolo আমার জান ,কেমন আসো?😚",
	"Bot বলে অসম্মান করচ্ছিছ,😰😿",
	"Hop bedi😾,Boss বল boss😼",
	"Bot না , জানু বল জানু 😘",
	"আমি গরীব এর সাথে কথা বলি না😼😼",
	"আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
	"আরে আমি মজা করার mood এ নাই😒",
	"হা জানু , এইদিক এ আসো কিস দেই🤭 😘",
	"দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
	"তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
	"আমাকে ডেকো না,আমি ব্যাস্ত আসি",
	"কি হলো ,মিস টিস করচ্ছিস নাকি🤣",
	"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
	"হা বলো, শুনছি আমি 😏",
	"আর কত বার ডাকবি ,শুনছি তো",
	"বলো কি করতে পারি তোমার জন্য",
	"আমি তো অন্ধ কিছু দেখি না🐸 😎",
	"Bot না জানু,বল 😌",
	"বলো জানু 🌚"
];

module.exports = {
	config: {
        name: "bot",
        aliases: ["baby", "bby", "বট", "bot"],
        version: "9.0.0",
        author: "SK-SIDDIK-KHAN",
        role: 0,
        usePrefix: false,
        description: "chat bot sim sim ai system",
        category: "fun",
        cooldown: 1,
    },

	onStart: async function({ event, api, args, message }) {
		const threadID = event.threadID;
		const senderID = event.senderID || event.userID;
		const name = (
			event.senderName ||
			event.name ||
			event.from?.first_name ||
			"User"
		).trim();

		const text = (
			event.body ||
			event.text ||
			""
		).trim();

		const lower = text.toLowerCase();

		if (!text)
			return;

		if (
			event.messageReply &&
			(
				event.messageReply.from?.is_bot ||
				event.messageReply.senderID === api.botInfo?.id
			)
		) {
			return await this.apiCall(
				api,
				threadID,
				name,
				text,
				senderID,
				event.messageID,
				message
			);
		}

		const keys = ["baby", "bby", "bot", "বট", "sim", "catbot"];
		const isKey = keys.some(k => lower.startsWith(k));
		let q = "";

		if (isKey) {
			q = text.split(" ").slice(1).join(" ").trim();

			if (!q) {
				const r = RAND[Math.floor(Math.random() * RAND.length)];

				const s = await message.reply(r);

				if (s?.messageID) {
					global.GoatBot.onReply.set(s.messageID, {
						commandName: "bot"
					});
				}

				return s;
			}
		}
		else {
			q = args.join(" ").trim();

			if (keys.includes(args[0]?.toLowerCase()))
				q = args.slice(1).join(" ").trim();

			if (!q)
				return;
		}

		return await this.apiCall(
			api,
			threadID,
			name,
			q,
			senderID,
			event.messageID,
			message
		);
	},

	apiCall: async function(api, threadID, name, q, senderID, replyId, message) {
		try {
			const base = await getApiUrl();

			const res = await axios.get(
				`${base}/sim?type=ask&ask=${encodeURIComponent(q)}&senderID=${senderID}`,
				{ timeout: 15000 }
			);

			const msg =
				res.data.data?.msg ||
				res.data.msg ||
				"বলো জানু 🥺";

			const s = await message.reply(msg);

			if (s?.messageID) {
				global.GoatBot.onReply.set(s.messageID, {
					commandName: "bot"
				});
			}

			return s;
		}
		catch {
			const r = RAND[Math.floor(Math.random() * RAND.length)];

			const s = await message.reply(r);

			if (s?.messageID) {
				global.GoatBot.onReply.set(s.messageID, {
					commandName: "bot"
				});
			}

			return s;
		}
	},

	onReply: async function({ event, api, message }) {
		const threadID = event.threadID;
		const senderID = event.senderID || event.userID;

		const name = (
			event.senderName ||
			event.name ||
			"User"
		).trim();

		const text = (
			event.body ||
			event.text ||
			""
		).trim();

		if (!text)
			return;

		return await this.apiCall(
			api,
			threadID,
			name,
			text,
			senderID,
			event.messageID,
			message
		);
	}
};
