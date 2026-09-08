module.exports = {
	config: {
        name: "set",
        aliases: [],
        version: "2.0",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 2,
        usePrefix: true,
        description: { en: "Command description" },
        category: "admin",
        guide: {
        		en:
        			"{pn}set money [amount] [@user]\n" +
        			"{pn}set exp [amount] [@user]\n" +
        			"{pn}set custom [variable] [value] [@user]"
        	},
        shortDescription: "Admin data management",
        longDescription: "Set user money, exp, or custom variables",
    },

	onStart: async function ({ message, event, args, usersData }) {
		try {
			const action = args[0]?.toLowerCase();
			const mentions = event.mentions || {};
			const targetID =
				Object.keys(mentions)[0] || event.senderID;

			const userData = await usersData.get(targetID);

			if (!userData) {
				return message.reply(
					"❌ User not found in database."
				);
			}

			switch (action) {
				case "money": {
					const amount = Number(args[1]);

					if (!Number.isFinite(amount) || amount < 0) {
						return message.reply(
							"❌ Invalid amount."
						);
					}

					await usersData.set(targetID, {
						money: amount
					});

					return message.reply(
						`💰 Money set to ${amount} for ${userData.name || "User"}`
					);
				}

				case "exp": {
					const amount = Number(args[1]);

					if (!Number.isFinite(amount) || amount < 0) {
						return message.reply(
							"❌ Invalid amount."
						);
					}

					await usersData.set(targetID, {
						exp: amount
					});

					return message.reply(
						`🌟 EXP set to ${amount} for ${userData.name || "User"}`
					);
				}

				case "custom": {
					const variable = args[1];
					const value = args[2];

					if (!variable || value === undefined) {
						return message.reply(
							"❌ Usage: {pn}set custom [variable] [value] [@user]"
						);
					}

					const data = userData.data || {};
					data[variable] = value;

					await usersData.set(targetID, {
						data
					});

					return message.reply(
						`🔧 Set ${variable} to ${value} for ${userData.name || "User"}`
					);
				}

				default:
					return message.reply(
						"❌ Invalid action.\n\n" +
						"Available commands:\n" +
						"• {pn}set money [amount] [@user]\n" +
						"• {pn}set exp [amount] [@user]\n" +
						"• {pn}set custom [variable] [value] [@user]"
					);
			}
		} catch (error) {
			console.error("[SET ERROR]", error);

			return message.reply(
				"⚠️ Command failed: " + error.message
			);
		}
	}
};