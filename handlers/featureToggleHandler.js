const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../disabledFeatures.json');

// Inisialisasi file JSON jika belum ada
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');

// Baca data fitur yang dinonaktifkan
let disabledData = JSON.parse(fs.readFileSync(filePath));

// Simpan ke file
function save() {
  fs.writeFileSync(filePath, JSON.stringify(disabledData, null, 2));
}

// Cek apakah fitur dimatikan untuk grup tertentu
function isDisabled(groupId, feature) {
  const fitur = disabledData[groupId] || [];
  return fitur.includes(feature);
}

// Tambahkan fitur ke daftar disable
function disableFeature(groupId, feature) {
  if (!disabledData[groupId]) disabledData[groupId] = [];
  if (!disabledData[groupId].includes(feature)) {
    disabledData[groupId].push(feature);
    save();
  }
}

// Hapus fitur dari daftar disable
function enableFeature(groupId, feature) {
  if (!disabledData[groupId]) return;
  disabledData[groupId] = disabledData[groupId].filter(f => f !== feature);
  save();
}

// 🔒 Daftar admin bot
const botAdmins = ['6281292744550']; // Ganti dengan nomor kamu

// Tangani perintah !disable dan !enable
async function handleFeatureToggle(msg, senderNumber, text) {
  const [command, feature] = text.split(' ');

  // Cek hanya untuk grup
  if (!msg.from.endsWith('@g.us')) {
    await msg.reply('❌ Perintah ini hanya bisa digunakan di grup.');
    return;
  }

  // Cek apakah pengirim admin bot
  if (!botAdmins.includes(senderNumber)) {
    await msg.reply('❌ Kamu bukan admin bot.');
    return;
  }

  const chat = await msg.getChat();
  const groupId = chat.id._serialized;

  if (!feature) {
    await msg.reply('❗ Contoh penggunaan: `!disable afk` atau `!enable afk`');
    return;
  }

  if (command === '!disable') {
    disableFeature(groupId, feature);
    await msg.reply(`🚫 Fitur *${feature}* berhasil dinonaktifkan.`);
  }

  if (command === '!enable') {
    enableFeature(groupId, feature);
    await msg.reply(`✅ Fitur *${feature}* berhasil diaktifkan kembali.`);
  }
}

module.exports = {
  isDisabled,
  handleFeatureToggle
};
