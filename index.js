const { Telegraf } = require('telegraf');
const config = require('./config');
const store = require('./store');
const messages = require('./messages');
const kb = require('./keyboards');

if (!config.BOT_TOKEN) {
  console.error("Missing BOT_TOKEN in .env");
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

// state: عمليات الأدمن (رسالة قادمة)
const pendingAdmin = {}; // { [userId]: "broadcast" | "channel_post" | "set_bio" }

// Helpers
function isAdmin(ctx){
  const id = String(ctx.from?.id || '');
  return config.ADMIN_IDS.includes(id);
}

function langOf(ctx){
  return store.getLang(ctx.from.id);
}

function getAinBioUrl(){
  const st = store.getState();
  return st.ainBioUrl || config.AIN_BIO_URL;
}

async function renderMenu(ctx, opts = {}){
  const lang = opts.lang || langOf(ctx);
  const st = store.getState();
  const text = opts.text || messages[lang].welcome;
  const markup = { reply_markup: kb.mainMenu(lang, st.storeOpen) };

  // إذا كان callback من زر: نعدل نفس الرسالة (فخامة)
  try{
    if (ctx.updateType === 'callback_query') {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', ...markup });
    } else {
      await ctx.reply(text, { parse_mode: 'Markdown', ...markup });
    }
  } catch {
    // fallback إذا ما قدر يعدّل (مثلاً الرسالة مو قابلة للتعديل)
    await ctx.reply(text, { parse_mode: 'Markdown', ...markup });
  }
}

// Start/Menu
bot.start(async (ctx) => renderMenu(ctx));
bot.command('menu', async (ctx) => renderMenu(ctx));
bot.command('lang', async (ctx) => {
  const current = store.getLang(ctx.from.id);
  store.setLang(ctx.from.id, current === 'en' ? 'ar' : 'en');
  await renderMenu(ctx);
});

// Buttons
bot.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await renderMenu(ctx);
});

bot.action('lang', async (ctx) => {
  await ctx.answerCbQuery();
  const current = store.getLang(ctx.from.id);
  store.setLang(ctx.from.id, current === 'en' ? 'ar' : 'en');
  await renderMenu(ctx);
});

bot.action('store', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const st = store.getState();

  if (!st.storeOpen) {
    // قريباً
    await renderMenu(ctx, { lang, text: messages[lang].storeSoon });
  } else {
    // لاحقاً تقدر تحط رابط المتجر
    await renderMenu(ctx, { lang, text: "🛍️ Store is open (link later) / المتجر مفتوح (بنحط الرابط لاحقاً)" });
  }
});

bot.action('bio', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const url = getAinBioUrl();
  const text = messages[lang].bioText;

  try{
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: kb.bioMenu(lang, url),
    });
  } catch {
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: kb.bioMenu(lang, url),
    });
  }
});

bot.action('subscribe', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  const added = store.addSubscriber(ctx.chat.id);
  const msg = added ? messages[lang].subscribedNew : messages[lang].subscribedAlready;

  // بدل ما يرسل رسائل كثيرة: نعدل النص فقط (نفس الشاشة)
  await renderMenu(ctx, { lang, text: msg + "\n\n" + messages[lang].welcome });
});

// Admin panel
bot.action('admin', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) {
    // لا نطلع الأدمن لغيره
    return renderMenu(ctx, { lang, text: messages[lang].adminOnly + "\n\n" + messages[lang].welcome });
  }

  const st = store.getState();
  try{
    await ctx.editMessageText(messages[lang].adminPanel + "\n\n" + messages[lang].storeStatus(st.storeOpen), {
      parse_mode: 'Markdown',
      reply_markup: kb.adminMenu(lang, st.storeOpen),
    });
  } catch {
    await ctx.reply(messages[lang].adminPanel, {
      parse_mode: 'Markdown',
      reply_markup: kb.adminMenu(lang, st.storeOpen),
    });
  }
});

bot.action('admin_toggle_store', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) return;

  const st = store.getState();
  const next = store.setState({ storeOpen: !st.storeOpen });

  try{
    await ctx.editMessageText(messages[lang].adminPanel + "\n\n" + messages[lang].storeStatus(next.storeOpen), {
      parse_mode: 'Markdown',
      reply_markup: kb.adminMenu(lang, next.storeOpen),
    });
  } catch {
    await ctx.reply(messages[lang].storeStatus(next.storeOpen));
  }
});

bot.action('admin_broadcast', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) return;

  pendingAdmin[String(ctx.from.id)] = 'broadcast';
  await ctx.reply(messages[lang].askBroadcast);
});

bot.action('admin_channel_post', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) return;

  pendingAdmin[String(ctx.from.id)] = 'channel_post';
  await ctx.reply(messages[lang].askChannelPost);
});

bot.action('admin_set_bio', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = langOf(ctx);
  if (!isAdmin(ctx)) return;

  pendingAdmin[String(ctx.from.id)] = 'set_bio';
  await ctx.reply(messages[lang].setBioAsk);
});

// Admin text handler
bot.on('text', async (ctx) => {
  const uid = String(ctx.from.id);
  if (!pendingAdmin[uid]) return;

  const action = pendingAdmin[uid];
  delete pendingAdmin[uid];

  const lang = langOf(ctx);
  const text = (ctx.message?.text || '').trim();
  if (!text) return;

  if (!isAdmin(ctx)) return;

  if (action === 'set_bio') {
    store.setState({ ainBioUrl: text });
    return ctx.reply(messages[lang].setBioDone);
  }

  if (action === 'channel_post') {
    try{
      await ctx.telegram.sendMessage(config.CHANNEL_USERNAME, text, { disable_web_page_preview: false });
      return ctx.reply(messages[lang].channelPostDone);
    } catch (e) {
      return ctx.reply("⚠️ ما قدر ينشر في القناة. تأكد البوت Admin في القناة واسم القناة صحيح.");
    }
  }

  if (action === 'broadcast') {
    const subs = store.getSubscribers().ids;
    let ok = 0, fail = 0;

    for (const chatId of subs) {
      try{
        await ctx.telegram.sendMessage(chatId, text, { disable_web_page_preview: false });
        ok++;
      } catch {
        fail++;
      }
    }

    return ctx.reply(messages[lang].broadcastDone(ok, fail));
  }
});

// graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();
console.log('AIN STORE bot is running...');