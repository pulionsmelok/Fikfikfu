const axios = require("axios");
 
module.exports = {
  config: {
        name: "rmvbg",
        aliases: ["removebg", "rbg"],
        version: "1.0.0",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        usePrefix: true,
        description: { en: "Command description" },
        category: "image",
        guide: {
      en: "${pn} reply to an image to remove its background."
    },
        longDescription: "Remove background from images.",
    },
  onStart: async function ({ message, api, args, event }) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("Please reply to an image to remove its background.");
    }
 
    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    const puti = 'xyz';
    const rbgUrl = `https://smfahim.${puti}/rbg?url=${imgurl}`;
 
    api.setMessageReaction("⏰", event.messageID, () => {}, true);
 
    message.reply("🔄| Removing background, please wait...", async (err, info) => {
      try {
        const attachment = await global.utils.getStreamFromURL(rbgUrl);
        message.reply({ 
          body: `╰‣ Here is your image with the background removed`, 
          attachment: attachment 
        });
 
        let ui = info.messageID;          
        message.unsend(ui);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      } catch (error) {
        message.reply("╰‣ There was an error removing the background from your image");
        console.error(error);
      }
    });
  }
};
