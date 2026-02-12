require('dotenv').config();

function splitCSV(s){
  return String(s || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_IDS: splitCSV(process.env.ADMIN_IDS).map(x => String(x)),
  AIN_BIO_URL: process.env.AIN_BIO_URL || 'https://example.com',
  CHANNEL_USERNAME: process.env.CHANNEL_USERNAME || '@ainstoreofficial',
};