const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const CONFIG_FILE = global.client?.dirConfig || path.join(process.cwd(), "config.json");
const PANEL_DEFAULTS = {
  maintenance: false,
  onlyBotAdmin: false,
  antilink: false,
  spammute: false,
  cooldown: false,
  autoReact: false,
  alwaysEmoji: false,
  welcome: true,
  leave: true
};

function admins() {
  return (global.GoatBot?.config?.adminBot || []).map(String).filter(Boolean);
}
function isBotAdmin(id) { return admins().includes(String(id)); }
async function saveConfig() {
  try { await fs.writeJson(global.client.dirConfig || CONFIG_FILE, global.GoatBot.config, { spaces: 2 }); } catch (_) {}
}
function panel() {
  global.GoatBot.config.settingPanel = { ...PANEL_DEFAULTS, ...(global.GoatBot.config.settingPanel || {}) };
  return global.GoatBot.config.settingPanel;
}
function mark(v) { return v ? "🟢 ON" : "🔴 OFF"; }
function safe(v) { return String(v).replace(/[<>]/g, ""); }

function homeText() {
  const p = panel();
  return `┌────◇【 S1DD1K-BOT 】◇────┐\n│ ⚙️ CONTROL PANEL V1.0\n└────◇【 SIDDIK 】◇────┘\n\n⚙️ <b>General Settings</b>\n🔐 <b>Security & Protection</b>\n💬 <b>Message & Events</b>\n🛡️ <b>Role Manager</b>\n📊 <b>System</b>\n\nPrefix: <code>${safe(global.GoatBot.config.prefix || "/")}</code>\nMaintenance: ${mark(p.maintenance)}`;
}
function keyboard() {
  return [[
    { text: "⚙️ General Settings", callback_data: "setting:general" }
  ],[
    { text: "🔐 Security & Protection", callback_data: "setting:security" }
  ],[
    { text: "💬 Message & Events", callback_data: "setting:events" }
  ],[
    { text: "🛡️ Role Manager", callback_data: "setting:roles:0" }
  ],[
    { text: "📊 System", callback_data: "setting:system" },
    { text: "🔄 Restart", callback_data: "setting:restart" }
  ],[
    { text: "🔧 Fix Files", callback_data: "setting:fix" },
    { text: "🧹 Clear Cache", callback_data: "setting:cache" }
  ]];
}
function pageKeyboard(page, total) {
  const row = [];
  if (page > 0) row.push({ text: "⬅️ Prev", callback_data: `setting:roles:${page - 1}` });
  if (page < total - 1) row.push({ text: "Next ➡️", callback_data: `setting:roles:${page + 1}` });
  return [row, [{ text: "⬅️ Back", callback_data: "setting:home" }]].filter(r => r.length);
}
function commandRoleText(page = 0) {
  const cmds = [...(global.GoatBot?.commands?.values?.() || [])]
    .filter(c => c?.config?.name)
    .sort((a,b) => String(a.config.name).localeCompare(String(b.config.name)));
  const per = 8;
  const total = Math.max(1, Math.ceil(cmds.length / per));
  page = Math.max(0, Math.min(Number(page) || 0, total - 1));
  const slice = cmds.slice(page * per, page * per + per);
  let text = `🛡️ <b>ROLE MANAGER</b>\n\n`;
  text += slice.map(c => {
    const r = typeof c.config.role === "number" ? c.config.role : (c.config.role?.onStart ?? 0);
    const icon = r >= 2 ? "🔒" : r === 1 ? "🛡️" : "🌐";
    return `${icon} /${safe(c.config.name)} [${r}]`;
  }).join("\n") || "No commands found.";
  text += `\n\n📄 ${page + 1}/${total}`;
  return { text, keyboard: pageKeyboard(page, total) };
}

function general() {
  const c = global.GoatBot.config;
  return {
    text: `⚙️ <b>GENERAL SETTINGS</b>\n\n🔧 Prefix: <code>${safe(c.prefix || "/")}</code>\n👑 AdminOnly: ${mark(c.adminOnly?.enable)}\n🌐 Language: ${safe(c.language || "en")}`,
    keyboard: [
      [{ text: `🔧 Prefix: ${safe(c.prefix || "/")}`, callback_data: "setting:prefix" }],
      [{ text: `${c.adminOnly?.enable ? "🟢" : "🔴"} AdminOnly`, callback_data: "setting:adminonly" }],
      [{ text: "⬅️ Back", callback_data: "setting:home" }]
    ]
  };
}
function security() {
  const p = panel();
  return {
    text: `🔐 <b>SECURITY & PROTECTION (GLOBAL)</b>\n\n📌 ON = system active\n📌 OFF = system disabled\n\n🟢 = ON | 🔴 = OFF`,
    keyboard: [
      [{ text: `${mark(p.onlyBotAdmin)} - Only Bot Admin Can Use Bot`, callback_data: "setting:toggle:onlyBotAdmin" }],
      [{ text: `${mark(p.maintenance)} - Maintenance`, callback_data: "setting:toggle:maintenance" }],
      [{ text: `${mark(p.antilink)} - Anti-Link`, callback_data: "setting:toggle:antilink" }],
      [{ text: `${mark(p.spammute)} - Spam Mute`, callback_data: "setting:toggle:spammute" }],
      [{ text: `${mark(p.cooldown)} - Cooldown`, callback_data: "setting:toggle:cooldown" }],
      [{ text: "⬅️ Back", callback_data: "setting:home" }]
    ]
  };
}
function events() {
  const p = panel();
  return {
    text: `💬 <b>MESSAGE & EVENTS</b>\n\n${mark(p.autoReact)} Auto React\n${mark(p.alwaysEmoji)} Always Emoji\n${mark(p.welcome)} Welcome Message\n${mark(p.leave)} Leave Message`,
    keyboard: [
      [{ text: `${mark(p.autoReact)} - Auto React`, callback_data: "setting:toggle:autoReact" }],
      [{ text: `${mark(p.alwaysEmoji)} - Always Emoji`, callback_data: "setting:toggle:alwaysEmoji" }],
      [{ text: `${mark(p.welcome)} - Welcome Message`, callback_data: "setting:toggle:welcome" }],
      [{ text: `${mark(p.leave)} - Leave Message`, callback_data: "setting:toggle:leave" }],
      [{ text: "⬅️ Back", callback_data: "setting:home" }]
    ]
  };
}
function system() {
  const c = global.GoatBot.config;
  const users = global.db?.allUserData?.length || 0;
  const groups = global.db?.allThreadData?.length || 0;
  const cmds = global.GoatBot?.commands?.size || 0;
  return {
    text: `📊 <b>SYSTEM</b>\n\nCmds: ${cmds} | Users: ${users} | Groups: ${groups}\nRAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB / ${Math.round(os.totalmem() / 1024 / 1024)} MB\nPrefix: ${safe(c.prefix || "/")}`,
    keyboard: [[{ text: "⬅️ Back", callback_data: "setting:home" }]]
  };
}

async function render(bot, event, view) {
  const opts = { reply_markup: { inline_keyboard: view.keyboard } };
  const chatId = event.threadID;
  const messageId = event.messageID;
  if (event.type === "callback_query" && messageId && bot?.editMessageText) {
    try { await bot.editMessageText(chatId, messageId, view.text, opts); return; } catch (_) {}
  }
  await bot.sendMessage({ body: view.text, parse_mode: "HTML", ...opts }, chatId);
}

module.exports = {
  config: {
    name: "setting",
    aliases: ["settings", "botsetting"],
    version: "3.0-PANEL",
    author: "SK-SIDDIK-KHAN",
    countDown: 3,
    role: 2,
    usePrefix: true,
    description: { en: "Interactive bot control panel" },
    category: "owner",
    guide: { en: "{pn}" }
  },
  onStart: async function ({ event, bot, message }) {
    const uid = String(event.senderID || event.userID || "");
    if (!isBotAdmin(uid)) return message.reply("❌ Only Bot Admin can open the setting panel.");
    panel();
    await render(bot || global.GoatBot.telegramApi, event, { text: homeText(), keyboard: keyboard() });
  },
  onCallback: async function ({ event, bot }) {
    const uid = String(event.senderID || event.userID || event.from?.id || "");
    if (!isBotAdmin(uid)) {
      try { await bot.answerCallbackQuery(event.callbackQueryID, "❌ Bot admin only", true); } catch (_) {}
      return;
    }
    const data = String(event.callbackData || event.data || "").split(":");
    if (data[0] !== "setting") return;
    const action = data[1];
    const b = bot || global.GoatBot.telegramApi;
    try { if (event.callbackQueryID) await b.answerCallbackQuery(event.callbackQueryID); } catch (_) {}

    if (action === "home") return render(b, event, { text: homeText(), keyboard: keyboard() });
    if (action === "general") return render(b, event, general());
    if (action === "security") return render(b, event, security());
    if (action === "events") return render(b, event, events());
    if (action === "system") return render(b, event, system());
    if (action === "roles") { const v = commandRoleText(Number(data[2] || 0)); return render(b, event, v); }
    if (action === "toggle") {
      const key = data[2];
      if (!Object.prototype.hasOwnProperty.call(PANEL_DEFAULTS, key)) return;
      const p = panel(); p[key] = !p[key]; await saveConfig();
      const v = ["autoReact", "alwaysEmoji", "welcome", "leave"].includes(key) ? events() : security();
      return render(b, event, v);
    }
    if (action === "adminonly") {
      global.GoatBot.config.adminOnly = global.GoatBot.config.adminOnly || { enable: false, ignoreCommand: [] };
      global.GoatBot.config.adminOnly.enable = !global.GoatBot.config.adminOnly.enable;
      await saveConfig(); return render(b, event, general());
    }
    if (action === "prefix") return b.sendMessage("✏️ Prefix change: use /setpf <newPrefix>", event.threadID);
    if (action === "cache") {
      const cacheDir = path.join(process.cwd(), "cache");
      try { await fs.ensureDir(cacheDir); for (const n of await fs.readdir(cacheDir)) await fs.remove(path.join(cacheDir, n)); } catch (_) {}
      return render(b, event, { text: "✅ <b>Cache Cleared!</b>\n\nAll temporary cache files were removed.", keyboard: [[{ text: "⬅️ Back", callback_data: "setting:home" }]] });
    }
    if (action === "fix") {
      try { await fs.ensureDir(path.join(process.cwd(), "cache")); panel(); await saveConfig(); } catch (_) {}
      return render(b, event, { text: "🔧 <b>Fix Files</b>\n\n✅ Basic config/cache checks completed.", keyboard: [[{ text: "⬅️ Back", callback_data: "setting:home" }]] });
    }
    if (action === "restart") {
      await b.sendMessage("🔄 Restarting bot...", event.threadID);
      setTimeout(() => process.exit(2), 300);
    }
  }
};
