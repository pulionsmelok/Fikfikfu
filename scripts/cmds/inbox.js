module.exports = {
  config: {
    name: "inbox",
    aliases: ["in"],
    version: "1.0.6",
    author: "SK-SIDDIK-KHAN",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Bot will go to your inbox and add your group"
    },
    category: "fun",
    guide: {
      en: "{pn}"
    },
    usePrefix: true
  },

  onStart: async function ({ api, event, args }) {
    try {
      await api.sendMessage(
        "✅ SUCCESSFULLY SEND MESSAGE\n\n🔰 PLEASE CHECK YOUR INBOX, PLEASE SEE IT😘",
        event.threadID,
        null,
        event.messageID
      );

      await api.sendMessage(
        "✅ HELLO, BROTHER AND SISTER\n🔰 NOW I AM IN YOUR INBOX, ADD YOUR GROUP❤️‍🩹",
        event.senderID
      );

    } catch (error) {
      console.error("Error bro:", error);
    }
  }
};