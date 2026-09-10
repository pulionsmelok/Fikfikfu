module.exports = {
  config: {
    name: "setgcpic",
    aliases: ["changegcpic", "gcpic", "gcphoto"],
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 1,
    usePrefix: true,
    description: "Change group photo with confirmation",
    category: "admin",
    guide: {
      en: "{pn}"
    },
    cooldown: 10
  },

  onStart: async function ({ event, api, message, chatId, userId }) {
    if (!message.isGroup) {
      return message.reply("❌ This command can only be used in groups.");
    }

    const adminList = await api.getChatAdministrators(chatId);

    const isAdmin = adminList.some(
      admin => String(admin.user.id) === String(userId)
    );

    const botAdmins =
      global.GoatBot.config.adminBot ||
      global.GoatBot.config.adminUID ||
      [];

    const isBotAdmin = botAdmins
      .map(String)
      .includes(String(userId));

    if (!isAdmin && !isBotAdmin) {
      return message.reply("⚠️ Only group admins can use this command.");
    }

    const botInfo = global.botInfo || await api.getMe();

    const botMember = adminList.find(
      admin => String(admin.user.id) === String(botInfo.id)
    );

    if (!botMember) {
      return message.reply(
        "❌ Bot needs admin rights to change group photo."
      );
    }

    const msg = event.reply_to_message || event;

    let photoFileId = null;

    if (msg.photo && msg.photo.length > 0) {
      photoFileId = msg.photo[msg.photo.length - 1].file_id;
    }

    if (!photoFileId) {
      return message.reply(
        `❌ Please send or reply to a photo to set as group picture.\n\n` +
        `💡 Usage:\n` +
        `1. Reply to a photo with /setgcpic\n` +
        `2. Send /setgcpic with a photo`
      );
    }

    const chat = await api.getChat(chatId);

    const confirmText =
      `🖼️ Change Group Photo?\n\n` +
      `📂 Group: ${chat.title}\n\n` +
      `⚠️ This will change the group photo for all members.\n` +
      `Click the button below to confirm.`;

    const keyboard = message.Markup.inlineKeyboard([
      [
        message.Markup.button.callback(
          "✅ Confirm",
          `confirm_gcpic_${chatId}`
        ),
        message.Markup.button.callback(
          "❌ Cancel",
          `cancel_gcpic_${chatId}`
        )
      ]
    ]);

    global.onCallback.set(`confirm_gcpic_${chatId}`, {
      commandName: "setgcpic",
      photoFileId,
      userId,
      chatId
    });

    global.onCallback.set(`cancel_gcpic_${chatId}`, {
      commandName: "setgcpic",
      userId,
      chatId
    });

    return message.reply(confirmText, keyboard);
  },

  onCallback: async function ({ event, api, message, ctx }) {
    const data = event.data;
    const userId = event.from.id;

    const chatIdMatch = data.match(/_(-?\d+)$/);

    if (!chatIdMatch) return;

    const chatId = chatIdMatch[1];

    const callbackData = global.onCallback.get(data);

    if (!callbackData) {
      return ctx.answerCbQuery(
        "❌ This action has expired!",
        { show_alert: true }
      );
    }

    if (String(callbackData.userId) !== String(userId)) {
      return ctx.answerCbQuery(
        "⚠️ Only the person who initiated this can confirm!",
        { show_alert: true }
      );
    }

    if (data.startsWith("confirm_gcpic_")) {
      try {
        const adminList = await api.getChatAdministrators(chatId);

        const botInfo = global.botInfo || await api.getMe();

        const botMember = adminList.find(
          admin => String(admin.user.id) === String(botInfo.id)
        );

        if (!botMember) {
          global.onCallback.delete(data);

          await ctx.editMessageText(
            "❌ Bot lost admin rights! Cannot change group photo."
          );

          return ctx.answerCbQuery(
            "❌ Bot needs admin rights!",
            { show_alert: true }
          );
        }

        const photoFileId = callbackData.photoFileId;

        /*
         * Telegram file_id সরাসরি setChatPhoto-তে দিলে
         * wrapper সেটা upload হিসেবে নেয় না।
         * তাই আগে file_id থেকে download URL নিচ্ছি।
         */
        const photoUrl = await api.getFileLink(photoFileId);

        /*
         * URL দিলে login.js-এর setChatPhoto()
         * photo download করে multipart InputFile হিসেবে upload করবে।
         */
        await api.setChatPhoto(chatId, photoUrl);

        global.onCallback.delete(data);
        global.onCallback.delete(`cancel_gcpic_${chatId}`);

        const chat = await api.getChat(chatId);

        await ctx.editMessageText(
          `✅ Group Photo Changed!\n\n` +
          `📂 Group: ${chat.title}\n` +
          `👤 Changed by: ${event.from.first_name}`
        );

        return ctx.answerCbQuery(
          "✅ Group photo changed successfully!"
        );

      } catch (error) {
        global.onCallback.delete(data);
        global.onCallback.delete(`cancel_gcpic_${chatId}`);

        await ctx.editMessageText(
          `❌ Error changing group photo: ${error.message}`
        );

        return ctx.answerCbQuery(
          "❌ Failed to change photo!",
          { show_alert: true }
        );
      }
    }

    if (data.startsWith("cancel_gcpic_")) {
      global.onCallback.delete(`confirm_gcpic_${chatId}`);
      global.onCallback.delete(data);

      await ctx.editMessageText(
        "❌ Group photo change cancelled."
      );

      return ctx.answerCbQuery("❌ Cancelled!");
    }
  }
};