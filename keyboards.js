const { Markup } = require("telegraf");

module.exports = {
  mainMenu: (lang, storeOpen) => {
    const isEn = lang === 'en';
    
    // نصوص الأزرار
    const labels = {
      store: storeOpen ? (isEn ? '🛍️ Store' : '🛍️ المتجر') : (isEn ? '🛍️ Store (Soon)' : '🛍️ المتجر (قريباً)'),
      bio: '🌐 AIN BIO',
      alerts: isEn ? '🔔 Launch Alerts' : '🔔 إشعار الافتتاح',
      lang: isEn ? '🌍 العربية' : '🌍 English',
      admin: isEn ? '⚙️ Admin' : '⚙️ الأدمن'
    };

    // التنسيق: [صف1], [صف2], [صف3]
    return Markup.inlineKeyboard([
      [Markup.button.callback(labels.store, "store")], // زر المتجر كبير لوحده
      [
        Markup.button.callback(labels.bio, "bio"), 
        Markup.button.callback(labels.alerts, "subscribe")
      ], // زرين بجانب بعض
      [
        Markup.button.callback(labels.lang, "lang"), 
        Markup.button.callback(labels.admin, "admin")
      ] // زرين بجانب بعض
    ]);
  },

  bioMenu: (lang, url) => {
    const isEn = lang === 'en';
    return Markup.inlineKeyboard([
      [Markup.button.url(isEn ? 'Open AIN BIO ↗' : 'فتح الرابط ↗', url)],
      [Markup.button.callback(isEn ? '⬅ Back' : '⬅ رجوع', "back")]
    ]);
  },

  adminMenu: (lang, storeOpen) => {
    const isEn = lang === 'en';
    return Markup.inlineKeyboard([
      [Markup.button.callback(
        storeOpen ? (isEn ? '🔴 Close Store' : '🔴 إغلاق المتجر') : (isEn ? '🟢 Open Store' : '🟢 فتح المتجر'), 
        "admin_toggle_store"
      )],
      [
        Markup.button.callback(isEn ? '📣 Broadcast' : '📣 إعلان', "admin_broadcast"),
        Markup.button.callback(isEn ? '📢 Post' : '📢 نشر', "admin_channel_post")
      ],
      [Markup.button.callback(isEn ? '🌐 Set BIO URL' : '🌐 تغيير الرابط', "admin_set_bio")],
      [Markup.button.callback(isEn ? '⬅ Back' : '⬅ رجوع', "back")]
    ]);
  }
};
