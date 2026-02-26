// config.js
try { 
  require("dotenv").config(); 
} catch (e) {
  // في حال عدم وجود مكتبة dotenv (مثلاً في البيئة السحابية مباشرة)
}

function splitCSV(s) {
  return String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => String(x));
}

// نصيحة: الـ Secret Path يفضل يكون معقد شوي للأمان
const defaultSecret = "ain_secret_" + (process.env.BOT_TOKEN ? process.env.BOT_TOKEN.split(':')[0] : "default");

module.exports = {
  // توكن البوت الأساسي
  BOT_TOKEN: process.env.BOT_TOKEN,

  // إعدادات الويب هوك (للروايلوي)
  PUBLIC_URL: process.env.PUBLIC_URL,                 
  SECRET_PATH: process.env.SECRET_PATH || defaultSecret, 

  // الصلاحيات (IDs)
  OWNER_IDS: splitCSV(process.env.OWNER_IDS),
  ADMIN_IDS: splitCSV(process.env.ADMIN_IDS),
  MOD_IDS: splitCSV(process.env.MOD_IDS),

  // روابط ومعرفات
  AIN_BIO_URL: process.env.AIN_BIO_URL || "https://example.com",
  CHANNEL_USERNAME: process.env.CHANNEL_USERNAME || "@ainstoreofficial",

  // إضافة: التأكد من وجود التوكن لمنع تشغيل السيرفر بخطأ
  isConfigured: () => !!process.env.BOT_TOKEN
};

// تنبيه بسيط في الكونسول لو التوكن ناقص
if (!process.env.BOT_TOKEN) {
  console.warn("⚠️ WARNING: BOT_TOKEN is missing in environment variables!");
}
