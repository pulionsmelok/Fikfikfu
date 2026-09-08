module.exports = {
	config: {
		name: "autoUpdateThreadInfo",
		version: "2.0-TELEGRAM",
		author: "SK-SIDDIK-KHAN",
		usePrefix: true,
		category: "events"
	},

	onStart: async ({ threadsData, event }) => {
		const type = event.logMessageType;
		if (type !== "log:subscribe" && type !== "log:unsubscribe") return;

		return async function () {
			try {
				const threadID = String(event.threadID);
				let threadInfo = global.db.allThreadData.find(t => String(t.threadID) === threadID);
				if (!threadInfo) {
					try { threadInfo = await threadsData.get(threadID); } catch { return; }
				}
				const members = Array.isArray(threadInfo.members) ? threadInfo.members : [];

				if (type === "log:subscribe") {
					for (const user of event.logMessageData?.addedParticipants || []) {
						const id = String(user.userFbId);
						const index = members.findIndex(m => String(m.userID) === id);
						const data = {
							userID: id,
							name: user.fullName || user.userFbName || `User ${id}`,
							nickname: user.username ? `@${user.username}` : null,
							inGroup: true,
							count: index >= 0 ? (members[index].count || 0) : 0
						};
						if (index >= 0) members[index] = { ...members[index], ...data };
						else members.push(data);
					}
				} else {
					const id = String(event.logMessageData?.leftParticipantFbId || event.left_chat_member?.id || "");
					const member = members.find(m => String(m.userID) === id);
					if (member) member.inGroup = false;
				}
				await threadsData.set(threadID, members, "members");
			} catch (err) {
				console.log("[autoUpdateThreadInfo]", err?.message || err);
			}
		};
	}
};
