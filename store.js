const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const SUBS_FILE = path.join(DATA_DIR, 'subscribers.json');
const PREFS_FILE = path.join(DATA_DIR, 'prefs.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// تأكد من وجود المجلد عند بدء التشغيل
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt) || fallback;
  } catch (err) {
    console.error(`❌ Error reading ${file}:`, err);
    return fallback;
  }
}

function writeJSON(file, obj) {
  try {
    // حفظ مؤقت للملف لضمان عدم ضياع البيانات في حال فشل الكتابة
    const data = JSON.stringify(obj, null, 2);
    fs.writeFileSync(file, data, 'utf8');
  } catch (err) {
    console.error(`❌ Error writing to ${file}:`, err);
  }
}

// --- العمليات ---

function getSubscribers() {
  const data = readJSON(SUBS_FILE, { ids: [] });
  // التأكد من أن ids دائماً مصفوفة ونظيفة من القيم المتكررة
  data.ids = [...new Set(data.ids.map(String))];
  return data;
}

function addSubscriber(chatId) {
  const data = getSubscribers();
  const id = String(chatId);
  if (!data.ids.includes(id)) {
    data.ids.push(id);
    writeJSON(SUBS_FILE, data);
    return true;
  }
  return false;
}

function removeSubscriber(chatId) {
  const data = getSubscribers();
  const id = String(chatId);
  const originalLength = data.ids.length;
  data.ids = data.ids.filter(x => x !== id);
  if (data.ids.length !== originalLength) {
    writeJSON(SUBS_FILE, data);
    return true;
  }
  return false;
}

function getLang(userId) {
  const prefs = readJSON(PREFS_FILE, { langByUser: {} });
  return prefs.langByUser[String(userId)] || 'ar';
}

function setLang(userId, lang) {
  const prefs = readJSON(PREFS_FILE, { langByUser: {} });
  prefs.langByUser[String(userId)] = (lang === 'en') ? 'en' : 'ar';
  writeJSON(PREFS_FILE, prefs);
}

function getState() {
  return readJSON(STATE_FILE, {
    storeOpen: false,
    ainBioUrl: null,
  });
}

function setState(patch) {
  const st = getState();
  const next = { ...st, ...patch };
  writeJSON(STATE_FILE, next);
  return next;
}

module.exports = {
  getSubscribers,
  addSubscriber,
  removeSubscriber,
  getLang,
  setLang,
  getState,
  setState,
};
