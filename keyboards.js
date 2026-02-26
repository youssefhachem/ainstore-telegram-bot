function mainMenu(lang = 'ar', storeOpen = false) {
  const isEn = lang === 'en';
  
  // نصوص الأزرار حسب اللغة
  const labels = {
    store: storeOpen ? (isEn ? '🛍 Store' : '🛍 المتجر') : (isEn ? '🛍 Store (Soon)' : '🛍 المتجر (قريباً)'),
    bio: isEn ? '🌐 AIN BIO' : '🌐 AIN BIO',
    alerts: isEn ? '🔔 Alerts' : '🔔 الإشعارات',
    lang: isEn ? '🌍 العربية' : '🌍 English',
    admin: isEn ? '⚙️ Admin' : '⚙️ الأدمن'
  };

  return {
    inline_keyboard: [
      // زر المتجر نخليه كبير لوحده لأنه الأهم
      [{ text: labels.store, callback_data: 'store' }],
      // زرين بجانب بعض (BIO والإشعارات)
      [
        { text: labels.bio, callback_data: 'bio' },
        { text: labels.alerts, callback_data: 'subscribe' }
      ],
      // زرين بجانب بعض (اللغة والأدمن)
      [
        { text: labels.lang, callback_data: 'lang' },
        { text: labels.admin, callback_data: 'admin' }
      ]
    ]
  };
}

function bioMenu(lang = 'ar', url) {
  const isEn = lang === 'en';
  return {
    inline_keyboard: [
      [{ text: isEn ? 'Open AIN BIO ↗' : 'فتح الرابط ↗', url: url }],
      [{ text: isEn ? '⬅ Back' : '⬅ رجوع', callback_data: 'back' }]
    ]
  };
}

function adminMenu(lang = 'ar', storeOpen = false) {
  const isEn = lang === 'en';
  
  return {
    inline_keyboard: [
      // زر تبديل حالة المتجر مع إيموجي ذكي
      [{ 
        text: storeOpen 
          ? (isEn ? '🔴 Close Store' : '🔴 إغلاق المتجر') 
          : (isEn ? '🟢 Open Store' : '🟢 فتح المتجر'), 
        callback_data: 'admin_toggle_store' 
      }],
      // البرودكاست والقناة بجانب بعض
      [
        { text: isEn ? '📣 Broadcast' : '📣 إعلان', callback_data: 'admin_broadcast' },
        { text: isEn ? '📢 Post' : '📢 نشر', callback_data: 'admin_channel_post' }
      ],
      // تغيير الرابط
      [{ text: isEn ? '🌐 Set BIO URL' : '🌐 تغيير الرابط', callback_data: 'admin_set_bio' }],
      // زر الرجوع
      [{ text: isEn ? '⬅ Back' : '⬅ رجوع', callback_data: 'back' }]
    ]
  };
}

module.exports = {
  mainMenu,
  bioMenu,
  adminMenu,
};
