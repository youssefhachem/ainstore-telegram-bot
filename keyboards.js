function mainMenu(lang = 'ar', storeOpen = false){
  if (lang === 'en') {
    return {
      inline_keyboard: [
        [{ text: storeOpen ? '🛍 Store' : '🛍 Store (Soon)', callback_data: 'store' }],
        [{ text: '🌐 AIN BIO', callback_data: 'bio' }],
        [{ text: '🔔 Launch Alerts', callback_data: 'subscribe' }],
        [{ text: '🌍 Change Language', callback_data: 'lang' }],
        [{ text: '⚙️ Admin', callback_data: 'admin' }],
      ]
    };
  }

  return {
    inline_keyboard: [
      [{ text: storeOpen ? '🛍 المتجر' : '🛍 المتجر (قريباً)', callback_data: 'store' }],
      [{ text: '🌐 AIN BIO', callback_data: 'bio' }],
      [{ text: '🔔 إشعار الافتتاح', callback_data: 'subscribe' }],
      [{ text: '🌍 تغيير اللغة', callback_data: 'lang' }],
      [{ text: '⚙️ أدمن', callback_data: 'admin' }],
    ]
  };
}

function bioMenu(lang='ar', url){
  if (lang === 'en') {
    return {
      inline_keyboard: [
        [{ text: 'Open AIN BIO ↗', url }],
        [{ text: '⬅ Back', callback_data: 'back' }],
      ]
    };
  }
  return {
    inline_keyboard: [
      [{ text: 'Open AIN BIO ↗', url }],
      [{ text: '⬅ رجوع', callback_data: 'back' }],
    ]
  };
}

function adminMenu(lang='ar', storeOpen=false){
  if (lang === 'en') {
    return {
      inline_keyboard: [
        [{ text: storeOpen ? '🟢 Set Store: Coming Soon' : '🟢 Set Store: Open', callback_data: 'admin_toggle_store' }],
        [{ text: '📣 Broadcast to Subscribers', callback_data: 'admin_broadcast' }],
        [{ text: '📢 Post to Channel', callback_data: 'admin_channel_post' }],
        [{ text: '🌐 Set AIN BIO URL', callback_data: 'admin_set_bio' }],
        [{ text: '⬅ Back', callback_data: 'back' }],
      ]
    };
  }

  return {
    inline_keyboard: [
      [{ text: storeOpen ? '🔴 خلّه قريباً' : '🟢 افتح المتجر', callback_data: 'admin_toggle_store' }],
      [{ text: '📣 إرسال إعلان للمشتركين', callback_data: 'admin_broadcast' }],
      [{ text: '📢 نشر في القناة', callback_data: 'admin_channel_post' }],
      [{ text: '🌐 تغيير رابط AIN BIO', callback_data: 'admin_set_bio' }],
      [{ text: '⬅ رجوع', callback_data: 'back' }],
    ]
  };
}

module.exports = {
  mainMenu,
  bioMenu,
  adminMenu,
};