const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "mp3",
    aliases: ["convertmp3", "cnvtmp3"],
    author: "SK-SIDDIK-KHAN",
    version: "1.0.0",
    role: 0,
    usePrefix: true,
    shortDescription: "Convert video to MP3 🎧",
    longDescription: "Download video from URL and convert to MP3.",
    category: "media",
    guide: "{p}convertmp3 <video_url>"
  },

  onStart: async function({ api, args, event }) {
    const { threadID, messageID } = event;

    try {
      const url = args.join(" ") || event.messageReply?.attachments?.[0]?.url;

      if (!url)
        return api.sendMessage(
          "⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠɪᴅᴇᴏ ᴜʀʟ!",
          threadID,
          messageID
        );

      const processing = await api.sendMessage(
        "Mᴘ3 ᴘʀᴏᴄᴇssɪɴɢ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ ⏳",
        threadID
      );

      const { data } = await axios.get(url, {
        responseType: "arraybuffer"
      });

      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir))
        fs.mkdirSync(cacheDir, { recursive: true });

      const filePath = path.join(cacheDir, "video.mp3");

      fs.writeFileSync(filePath, Buffer.from(data));

      if (processing && processing.messageID)
        await api.unsendMessage(processing.messageID);

      return api.sendMessage(
        {
          body: "Mᴘ3 ʀᴇᴀᴅʏ ✅",
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        async () => {
          if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
        },
        messageID
      );

    } catch (err) {
      console.log(err);

      return api.sendMessage(
        "⚠️ Fᴀɪʟᴇᴅ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ᴠɪᴅᴇᴏ!",
        threadID,
        messageID
      );
    }
  }
};