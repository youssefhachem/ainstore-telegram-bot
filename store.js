const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const SUBS_FILE = path.join(DATA_DIR, 'subscribers.json');
const PREFS_FILE = path.join(DATA_DIR, 'prefs.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

function ensureDir(){
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file, fallback){
  ensureDir();
  try{
    if (!fs.existsSync(file)) return fallback;
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt || 'null') ?? fallback;
  }catch{
    return fallback;
  }
}

function writeJSON(file, obj){
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

function getSubscribers(){
  return readJSON(SUBS_FILE, { ids: [] });
}

function addSubscriber(chatId){
  const data = getSubscribers();
  const id = String(chatId);
  if (!data.ids.includes(id)) {
    data.ids.push(id);
    writeJSON(SUBS_FILE, data);
    return true;
  }
  return false;
}

function removeSubscriber(chatId){
  const data = getSubscribers();
  const id = String(chatId);
  const before = data.ids.length;
  data.ids = data.ids.filter(x => x !== id);
  writeJSON(SUBS_FILE, data);
  return data.ids.length !== before;
}

function getPrefs(){
  return readJSON(PREFS_FILE, { langByUser: {} });
}

function getLang(userId){
  const prefs = getPrefs();
  return prefs.langByUser[String(userId)] || 'ar';
}

function setLang(userId, lang){
  const prefs = getPrefs();
  prefs.langByUser[String(userId)] = (lang === 'en') ? 'en' : 'ar';
  writeJSON(PREFS_FILE, prefs);
}

function getState(){
  return readJSON(STATE_FILE, {
    storeOpen: false, // حالياً مغلق (قريباً)
    ainBioUrl: null,  // لو تبي تغييره من الأدمن
  });
}

function setState(patch){
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