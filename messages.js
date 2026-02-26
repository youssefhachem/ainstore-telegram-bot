module.exports = {
  ar: {
    welcome: `✨ **أهلاً بك في AIN STORE** ✨
\nبوابتك الرسمية والاحترافية لـ:
• إشعارات الافتتاح 🔔
• أقوى العروض الحصرية 🔥
• باقات **AIN BIO** 🌐
• اشتراكاتك المميزة 💎

يرجى اختيار القسم المطلوب من القائمة 👇`,

    storeSoon: `🚧 **العمل جارٍ على قدم وساق!**
نحن نجهز تجربة تسوق تليق بمستوى **AIN STORE**.

اضغط على "إشعار الافتتاح" لتكون أول من يعلم عند الانطلاق 🔔`,

    subscribedNew: `🎉 **أهلاً بك معنا!**\nتم اشتراكك بنجاح في نظام الإشعارات. سنوافيك بكل جديد فور حدوثه 🔔`,
    subscribedAlready: `✅ لا تقلق، أنت مشترك بالفعل في نظام الإشعارات لدينا 🔔`,
    unsubscribed: `✅ تم إلغاء الاشتراك بنجاح.`,

    bioText: `🌐 **خدمة AIN BIO**
\nحوّل وجودك الرقمي إلى صفحة احترافية تجمع كافة روابطك وباقاتك في مكان واحد وبلمسة عصرية.`,
    
    adminOnly: `⛔ **تنبيه:** هذه المنطقة مخصصة لفريق الإدارة فقط.`,
    adminPanel: `🛠 **لوحة التحكم الإدارية**\n\nتحكم في المتجر، أرسل التنبيهات، وحدث الروابط من هنا:`,
    
    askBroadcast: `✍️ **إرسال إعلان عام:**\nاكتب نص الإعلان الذي ترغب بإرساله لجميع المشتركين الآن.\n\n(لإلغاء العملية أرسل: **إلغاء**)`,
    askChannelPost: `✍️ **نشر في القناة:**\nاكتب النص الذي سيتم نشره في القناة الرسمية الآن.\n\n(لإلغاء العملية أرسل: **إلغاء**)`,
    
    broadcastDone: (ok, fail) => `📊 **تقرير الإرسال النهائي:**\n\n✅ تم التسليم بنجاح: ${ok}\n⚠️ فشل الإرسال لـ: ${fail}`,
    channelPostDone: `🚀 تم النشر في القناة الرسمية بنجاح!`,
    storeStatus: (open) => open ? `🟢 **حالة المتجر:** مفتوح الآن` : `🔴 **حالة المتجر:** مغلق (قريباً)`,
    
    setBioAsk: `✍️ يرجى إرسال رابط **AIN BIO** الجديد الآن:`,
    setBioDone: `✅ تم تحديث الرابط بنجاح! سيتم توجيه المستخدمين للرابط الجديد فوراً.`,
  },

  en: {
    welcome: `✨ **Welcome to AIN STORE** ✨
\nYour professional gateway for:
• Launch alerts 🔔
• Exclusive offers 🔥
• **AIN BIO** services 🌐
• Premium subscriptions 💎

Please choose from the menu below 👇`,

    storeSoon: `🚧 **Under Construction**
We are crafting a shopping experience worthy of the **AIN STORE** name.

Subscribe to launch alerts to stay updated 🔔`,

    subscribedNew: `🎉 **Welcome aboard!**\nYou've successfully subscribed to our launch alerts 🔔`,
    subscribedAlready: `✅ You're already on our VIP notification list 🔔`,
    unsubscribed: `✅ Unsubscribed successfully.`,

    bioText: `🌐 **AIN BIO Service**
\nTransform your digital presence into one professional page that gathers all your links & plans beautifully.`,
    
    adminOnly: `⛔ **Access Denied:** This section is for admins only.`,
    adminPanel: `🛠 **Admin Control Panel**\n\nManage store status, broadcasts, and links:`,
    
    askBroadcast: `✍️ **General Broadcast:**\nWrite the message you want to send to all subscribers.\n\n(To cancel, send: **cancel**)`,
    askChannelPost: `✍️ **Channel Post:**\nWrite the message to be posted on the official channel.\n\n(To cancel, send: **cancel**)`,
    
    broadcastDone: (ok, fail) => `📊 **Broadcast Report:**\n\n✅ Delivered: ${ok}\n⚠️ Failed: ${fail}`,
    channelPostDone: `🚀 Posted to the official channel successfully!`,
    storeStatus: (open) => open ? `🟢 **Store Status:** Open` : `🔴 **Store Status:** Coming Soon`,
    
    setBioAsk: `✍️ Please send the new **AIN BIO** URL:`,
    setBioDone: `✅ URL updated successfully! All users will now see the new link.`,
  }
};
