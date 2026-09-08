module.exports = {
  config: {
    name: "listbox",
    aliases: [],
    version: "2.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 2,
    usePrefix: true,
    shortDescription: {
      en: "List all group chats the bot is in."
    },
    longDescription: {
      en: "List all group chats currently registered in the bot."
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, threadsData }) {
    try {
      const threadList = await threadsData.getAll();

      const filteredList = threadList.filter(
        group => group && group.threadID && group.threadName
      );

      if (filteredList.length === 0) {
        return message.reply(
          "❌ 𝐍𝐨 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬 𝐟𝐨𝐮𝐧𝐝."
        );
      }

      const formattedList = filteredList.map((group, index) =>
        `│ ${index + 1}. ${group.threadName}\n` +
        `│ 𝐓𝐈𝐃: ${group.threadID}`
      );

      const result =
        "╭───────────⭓\n" +
        "│ 𝐋𝐈𝐒𝐓 𝐎𝐅 𝐆𝐑𝐎𝐔𝐏 𝐂𝐇𝐀𝐓𝐒\n" +
        "├───────────\n" +
        formattedList.join("\n│\n") +
        "\n╰───────────⭓";

      return message.reply(result);

    } catch (error) {
      console.error("Listbox command error:", error);

      return message.reply(
        "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐠𝐞𝐭 𝐠𝐫𝐨𝐮𝐩 𝐥𝐢𝐬𝐭."
      );
    }
  }
};