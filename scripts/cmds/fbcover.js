const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
        name: "fbcover",
        aliases: ["cover"],
        version: "1.1-TELEGRAM",
        author: "SK-SIDDIK-KHAN",
        countDown: 8,
        role: 0,
        usePrefix: true,
        description: { en: "Generate FB cover style image" },
        category: "image",
        guide: { en: "{pn} Name | Age | Address | Email | Link | Job" },
    },
	onStart: async function ({ args, message, event, api }) {
		try {
			const input = args.join(" ");
			if (!input.includes("|") && !input.includes("-")) {
				return message.reply(
`❌ Format:
fbcover Name | Age | Address | Email | Link | Job

Example:
fbcover SK SIDDIK | 20 | Dhaka | mail@x.com | fb/x | Developer`
				);
			}
			const parts = input.split(/\||\-/).map(s => s.trim()).filter(Boolean);
			const [name = "User", age = "N/A", address = "N/A", email = "N/A", link = "N/A", job = "N/A"] = parts;
			const url = `https://api.popcat.xyz/fbcover?name=${encodeURIComponent(name)}&color=blue&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&uid=${encodeURIComponent(link)}&suid=${encodeURIComponent(job)}`;
			const apis = [
				`https://api.popcat.xyz/welcomecard?background=https://cdn.discordapp.com/attachments/850667584393379853/1092912545674166282/bg.png&text1=${encodeURIComponent(name)}&text2=${encodeURIComponent(job)}&text3=${encodeURIComponent(address)}`,
			];
			const chatId = String(event.threadID || event.chat?.id || "");
			const tmp = path.join(__dirname, "tmp");
			await fs.ensureDir(tmp);
			const out = path.join(tmp, `fbcover_${Date.now()}.png`);
			let ok = false;
			for (const u of apis) {
				try {
					const res = await axios.get(u, { responseType: "arraybuffer"});
					await fs.writeFile(out, Buffer.from(res.data));
					ok = true;
					break;
				} catch {}
			}
			if (!ok) {
				return message.reply(
`✅ Cover text ready (image API offline)
👤 ${name}
🎂 ${age}
📍 ${address}
📧 ${email}
🔗 ${link}
💼 ${job}`
				);
			}
			try {
				await api.sendPhoto(chatId, { source: fs.createReadStream(out) }, {
					caption: `🖼️ FB Cover\n👤 ${name} | ${job}`
				});
			} catch {
				await message.reply({ body: "Cover image", attachment: fs.createReadStream(out) }).catch(() => {});
			}
			try { fs.unlinkSync(out); } catch {}
		} catch (e) {
			return message.reply("❌ Error: " + e.message);
		}
	}
};
