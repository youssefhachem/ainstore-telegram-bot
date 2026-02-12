module.exports = {
  ar: {
    welcome: `👑 **مرحباً بك في AIN STORE**
بوابتك الرسمية لـ:
• إشعار الافتتاح 🔔
• العروض 🔥
• AIN BIO 🌐
• الاشتراكات 💎

اختر من القائمة 👇`,

    storeSoon: `🚧 **قريباً جداً**
نجهّز شي يليق باسم **AIN STORE**.

اشترك بإشعار الافتتاح ونبلغك أول ما نفتح 🔔`,

    subscribedNew: `✅ تم اشتراكك بإشعار الافتتاح 🔔`,
    subscribedAlready: `✅ أنت مشترك بالفعل بإشعار الافتتاح 🔔`,
    unsubscribed: `تم إلغاء الاشتراك ✅`,

    bioText: `🌐 **AIN BIO**
كل روابطك وباقاتك في صفحة واحدة — بشكل احترافي.`,
    adminOnly: `⛔ هذا القسم للأدمن فقط.`,
    adminPanel: `👑 **لوحة الأدمن**
اختر العملية:`,
    askBroadcast: `✍️ اكتب رسالة الإعلان الآن (بتنرسل للمشتركين).`,
    askChannelPost: `✍️ اكتب رسالة القناة الآن (بتنرسل في @ainstoreofficial).`,
    broadcastDone: (ok, fail) => `✅ تم الإرسال: ${ok}\n⚠️ فشل: ${fail}`,
    channelPostDone: `✅ تم النشر في القناة.`,
    storeStatus: (open) => open ? `🟢 المتجر: مفتوح` : `🔴 المتجر: قريباً`,
    setBioAsk: `✍️ ارسل رابط AIN BIO الجديد الآن.`,
    setBioDone: `✅ تم تحديث رابط AIN BIO.`,
  },

  en: {
    welcome: `👑 **Welcome to AIN STORE**
Your official gateway for:
• Launch alerts 🔔
• Offers 🔥
• AIN BIO 🌐
• Subscriptions 💎

Choose from the menu 👇`,

    storeSoon: `🚧 **Coming Soon**
We’re preparing something worthy of **AIN STORE**.

Subscribe to launch alerts 🔔`,

    subscribedNew: `✅ You’re subscribed to launch alerts 🔔`,
    subscribedAlready: `✅ You’re already subscribed 🔔`,
    unsubscribed: `Unsubscribed ✅`,

    bioText: `🌐 **AIN BIO**
All your links & plans in one professional page.`,
    adminOnly: `⛔ Admins only.`,
    adminPanel: `👑 **Admin Panel**
Choose an action:`,
    askBroadcast: `✍️ Send your broadcast message now (to subscribers).`,
    askChannelPost: `✍️ Send your channel post now (to @ainstoreofficial).`,
    broadcastDone: (ok, fail) => `✅ Sent: ${ok}\n⚠️ Failed: ${fail}`,
    channelPostDone: `✅ Posted to channel.`,
    storeStatus: (open) => open ? `🟢 Store: Open` : `🔴 Store: Coming Soon`,
    setBioAsk: `✍️ Send the new AIN BIO URL now.`,
    setBioDone: `✅ AIN BIO URL updated.`,
  }
};