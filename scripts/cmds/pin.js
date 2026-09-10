module.exports = {
  config: {
    name: "pin",
    aliases: ["pinmsg", "unpin", "unpinmsg"],
    version: "1.2.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 2,
    role: 1,
    usePrefix: true,
    description: {
      en: "Pin / Unpin message in group"
    },
    category: "group",
    guide: {
      en: "{pn} (reply) → Pin message\n{pn} silent (reply) → Silent pin\n{pn} unpin (reply) → Unpin\n{pn} unpin all → Unpin all"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID || event.chat?.id;

    if (!threadID || !String(threadID).startsWith("-")) {
      return message.reply("❌ এই কমান্ড শুধু গ্রুপে কাজ করবে!");
    }

    const text = String(event.body || event.text || "").toLowerCase();
    const firstArg = String(args?.[0] || "").toLowerCase();

    if (
      firstArg === "unpin" ||
      text.includes("unpin") ||
      event.body?.toLowerCase()?.startsWith("/unpin")
    ) {
      if (
        firstArg === "all" ||
        args?.[1]?.toLowerCase() === "all" ||
        text.includes("unpin all")
      ) {
        try {
          await api.call("unpinAllChatMessages", {
            chat_id: threadID
          });
          return message.reply("✅ সব পিন রিমুভ করা হয়েছে!");
        } catch (e) {
          return message.reply(`❌ Unpin All Fail: ${e.message}`);
        }
      }

      const replyId =
        event.messageReply?.messageID ||
        event.messageReply?.message_id ||
        event.reply_to_message?.message_id;

      if (!replyId) {
        return message.reply("📌 যে মেসেজ আনপিন করতে চাও সেটাতে রিপ্লাই দিয়ে /unpin লিখো");
      }

      try {
        await api.call("unpinChatMessage", {
          chat_id: threadID,
          message_id: Number(replyId)
        });
        return message.reply("✅ Unpinned!");
      } catch (e) {
        return message.reply(`❌ Unpin Fail: ${e.message}`);
      }
    }

    const replyMsg =
      event.messageReply ||
      event.reply_to_message;

    if (!replyMsg) {
      return message.reply("📌 পিন করতে মেসেজে রিপ্লাই দাও!");
    }

    const msgId =
      replyMsg.messageID ||
      replyMsg.message_id;

    if (!msgId) {
      return message.reply("❌ Message ID পাওয়া যায়নি!");
    }

    const isSilent =
      firstArg === "silent" ||
      firstArg === "s";

    try {
      await api.call("pinChatMessage", {
        chat_id: threadID,
        message_id: Number(msgId),
        disable_notification: isSilent
      });

      return message.reply(
        isSilent ? "📌 Silent Pin Done! 🔕" : "📌 Pinned!"
      );
    } catch (e) {
      return message.reply(`❌ Pin Fail: ${e.message}`);
    }
  }
};