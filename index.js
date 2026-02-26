const express = require("express");
const { Telegraf } = require("telegraf");
const config = require("./config");
const store = require("./store");
const messages = require("./messages");
const kb = require("./keyboards");

if (!config.BOT_TOKEN) {
  console.error("❌ Missing BOT_TOKEN in environment variables");
  process.exit(1);
}

const app = express();
app.use(express.json());

const bot = new Telegraf(config.BOT_TOKEN);

// state: عمليات الأدمن (رسالة قادمة)
const pendingAdmin = {}; // { [userId]: "broadcast" | "channel_post" | "set_bio" }

/* =========================
   Roles / Permissions
   ========================= */

function uid(ctx) {
  return String(ctx.from?.id || "");
}

function list(arr) {
  return Array.isArray(arr) ? arr.map(String) : [];
}

function isOwner(ctx) {
  return list(config.OWNER_IDS).includes(uid(ctx));
}

function isAdmin(ctx) {
  return isOwner(ctx) || list(config.ADMIN_IDS).includes(uid(ctx));
}

function isMod(ctx) {
  return isAdmin(ctx) || list(config.MOD_IDS).includes(uid(ctx));
}
// حارس للأدمن فقط
const restrictToAdmin = async (ctx, next) => {
  if (isAdmin(ctx)) return next();
  const lang = langOf(ctx);
  return ctx.reply(messages[lang].adminOnly || "⛔ Admin only.");
};
/* =========================
   Helpers
   ========================= */

function langOf(ctx) {
  return store.getLang(ctx.from.id);
}

function getAinBioUrl() {
  const st = store.getState();
  return st.ainBioUrl || config.AIN_BIO_URL;
}

async function renderMenu(ctx, opts = {}) {
  const lang = opts.lang || langOf(ctx);
  const st = store.getState();
  const text = opts.text || messages[lang].welcome;
  const markup = { reply_markup: kb.mainMenu(lang, st.storeOpen) };

  try {
    if (ctx.updateType === "callback_query") {
      await ctx.editMessageText(text, { parse_mode: "Markdown", ...markup });
    } else {
      await ctx.reply(text, { parse_mode: "Markdown", ...markup });
    }
  } catch {
    await ctx.reply(text, { parse_mode: "Markdown", ...markup });
  }
}

/* =========================
   Debug Commands (temporary)
   ========================= */

bot.command("whoami", async (ctx) => {
  const id = uid(ctx);
  const role = isOwner(ctx) ? "OWNER" : isAdmin(ctx) ? "ADMIN" : isMod(ctx) ? "MOD" : "USER";

  return ctx.reply(
    `🆔 Your Telegram ID: ${id}\n👤 Role: ${role}\n\n` +
      `OWNER_IDS loaded: ${list(config.OWNER_IDS).length}\n` +
      `ADMIN_IDS loaded: ${list(config.ADMIN_IDS).length}\n` +
      `MOD_IDS loaded: ${list(config.MOD_IDS).length}`
  );
});

bot.command("roles", async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply("⛔ Admin only.");
  return ctx.reply(
    `✅ Roles loaded:\n` +
      `OWNER_IDS: ${list(config.OWNER_IDS).length}\n` +
      `ADMIN_IDS: ${list(config.ADMIN_IDS).length}\n` +
      `MOD_IDS: ${list(config.MOD_IDS).length}`
  );
});

/* =========================
   Start/Menu
   ========================= */

bot.start(async (ctx) => renderMenu(ctx));
bot.command("menu", async (ctx) => renderMenu(ctx));
bot.command("lang", async (ctx) => {
  const current = store.getLang(ctx.from.id);
  store.setLang(ctx.from.id, current === "en" ? "ar" : "en");
  await renderMenu(ctx);
});

/* =========================
   Buttons
   ========================= */

bot.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  await renderMenu(ctx);
});

bot.action("lang", async (ctx) => {
  // 1. الحصول على اللغة الحالية قبل التغيير
  const current = store.getLang(ctx.from.id);
  const nextLang = current === "en" ? "ar" : "en";
  
  // 2. تحديد رسالة التنبيه بناءً على اللغة الجديدة
  const toastMsg = nextLang === "ar" ? "تم تغيير اللغة إلى العربية 🇸🇦" : "Language changed to English 🇺🇸";

  try {
    // 3. إرسال التنبيه فوراً لإزالة علامة التحميل من الزر
    await ctx.answerCbQuery(toastMsg);

    // 4. تحديث اللغة في المتجر (Store)
    store.setLang(ctx.from.id, nextLang);

    // 5. إعادة تحديث القائمة لتظهر باللغة الجديدة
    await renderMenu(ctx);
  } catch (error) {
    console.error("Error in lang action:", error);
    // في حال فشل التعديل، نكتفي بإغلاق التحميل
    await ctx.answerCbQuery().catch(() => {});
  }
});

bot.action("store", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const st = store.getState();

  if (!st.storeOpen) {
    await renderMenu(ctx, { lang, text: messages[lang].storeSoon });
  } else {
    await renderMenu(ctx, { lang, text: "🛍️ Store is open (link later) / المتجر مفتوح (بنحط الرابط لاحقاً)" });
  }
});

bot.action("bio", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const url = getAinBioUrl();
  const text = messages[lang].bioText;

  try {
    await ctx.editMessageText(text, {
      parse_mode: "Markdown",
      reply_markup: kb.bioMenu(lang, url),
    });
  } catch {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: kb.bioMenu(lang, url),
    });
  }
});

bot.action("subscribe", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const added = store.addSubscriber(ctx.chat.id);
  const m = added ? messages[lang].subscribedNew : messages[lang].subscribedAlready;

  await renderMenu(ctx, { lang, text: m + "\n\n" + messages[lang].welcome });
});

/* =========================
   Admin Panel (Mod+)
   ========================= */

bot.action("admin", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);

  if (!isMod(ctx)) {
    return renderMenu(ctx, { lang, text: messages[lang].adminOnly + "\n\n" + messages[lang].welcome });
  }

  const st = store.getState();
  try {
    await ctx.editMessageText(messages[lang].adminPanel + "\n\n" + messages[lang].storeStatus(st.storeOpen), {
      parse_mode: "Markdown",
      reply_markup: kb.adminMenu(lang, st.storeOpen),
    });
  } catch {
    await ctx.reply(messages[lang].adminPanel, {
      parse_mode: "Markdown",
      reply_markup: kb.adminMenu(lang, st.storeOpen),
    });
  }
});

bot.action("admin_toggle_store", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);

  if (!isOwner(ctx)) {
    return ctx.reply("⛔ هذه الصلاحية للمالك فقط (Owner).");
  }

  const st = store.getState();
  const next = store.setState({ storeOpen: !st.storeOpen });

  try {
    await ctx.editMessageText(messages[lang].adminPanel + "\n\n" + messages[lang].storeStatus(next.storeOpen), {
      parse_mode: "Markdown",
      reply_markup: kb.adminMenu(lang, next.storeOpen),
    });
  } catch {
    await ctx.reply(messages[lang].storeStatus(next.storeOpen));
  }
});

bot.action("admin_broadcast", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) return ctx.reply("⛔ للأدمن فقط");

  pendingAdmin[uid(ctx)] = "broadcast";
  await ctx.reply("📝 أرسل رسالة البرودكاست الآن..\n\n(لإلغاء العملية أرسل كلمة 'إلغاء')");
});

bot.action("admin_channel_post", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);

  if (!isAdmin(ctx)) return ctx.reply("⛔ هذه الصلاحية للأدمن فقط (Admin).");

  pendingAdmin[uid(ctx)] = "channel_post";
  await ctx.reply(messages[lang].askChannelPost);
});

bot.action("admin_set_bio", async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);

  if (!isMod(ctx)) return ctx.reply("⛔ هذه الصلاحية للمود/الأدمن (Mod+).");

  pendingAdmin[uid(ctx)] = "set_bio";
  await ctx.reply(messages[lang].setBioAsk);
});

/* =========================
   Admin Text Handler
   ========================= */

bot.on("text", async (ctx) => {
  const u = uid(ctx);
  if (!pendingAdmin[u]) return; // إذا ما في عملية معلقة، لا تفعل شيئاً

  const action = pendingAdmin[u];
  const lang = langOf(ctx);
  const text = (ctx.message?.text || "").trim();

  // ميزة الإلغاء
  if (text.toLowerCase() === "cancel" || text === "إلغاء") {
    delete pendingAdmin[u];
    return ctx.reply("❌ تم إلغاء العملية بنجاح.");
  }

  // تنفيذ العمليات وحذف الحالة فوراً بعدها
  if (action === "set_bio") {
    store.setState({ ainBioUrl: text });
    delete pendingAdmin[u];
    return ctx.reply(messages[lang].setBioDone);
  }

  if (action === "broadcast") {
    const subs = store.getSubscribers().ids;
    delete pendingAdmin[u]; // نحذفها هنا عشان ما يرسل مرتين لو ضغط بسرعة
    let ok = 0, fail = 0;
    
    await ctx.reply("⏳ جاري الإرسال لجميع المشتركين...");
    
    for (const chatId of subs) {
      try {
        await ctx.telegram.sendMessage(chatId, text);
        ok++;
      } catch { fail++; }
    }
    return ctx.reply(messages[lang].broadcastDone(ok, fail));
  }
});

/* =========================
   Railway Webhook Server
   ========================= */

const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = `/${config.SECRET_PATH}/webhook`;

// Health
app.get("/", (req, res) => res.status(200).send("AIN STORE bot server is running ✅"));

// Webhook endpoint for Telegram
app.post(WEBHOOK_PATH, (req, res) => {
  bot.handleUpdate(req.body, res);
});

async function setupWebhook() {
  if (!config.PUBLIC_URL) {
    console.log("ℹ️ PUBLIC_URL not set. Skipping setWebhook.");
    return;
  }
  const full = `${config.PUBLIC_URL}${WEBHOOK_PATH}`;
  try {
    await bot.telegram.setWebhook(full);
    console.log("✅ Webhook set:", full);
  } catch (e) {
    console.error("❌ setWebhook failed:", e?.response?.description || e.message);
  }
}
// صيد الأخطاء ومنع البوت من التوقف
bot.catch((err, ctx) => {
  console.error(`❌ Error in ${ctx.updateType}:`, err);
  // إرسال رسالة تنبيه للمستخدم عشان ما يضل معلق
  ctx.reply("⚠️ حصل خطأ بسيط، جرب مرة ثانية أو تواصل مع الدعم.");
});
app.listen(PORT, async () => {
  console.log(`✅ Listening on ${PORT}`);
  await setupWebhook();
});
