const fs = require('fs');
const path = require('path');

const bannedPath = path.join(__dirname, '../banned.json');

// Load daftar ban dari file
function loadBanned() {
  if (!fs.existsSync(bannedPath)) fs.writeFileSync(bannedPath, '[]');
  return JSON.parse(fs.readFileSync(bannedPath));
}

// Simpan daftar ban ke file
function saveBanned(list) {
  fs.writeFileSync(bannedPath, JSON.stringify(list, null, 2));
}

// Inisialisasi daftar
let bannedList = loadBanned();

// Fungsi untuk pengecekan nomor terban
function isBanned(number) {
  return bannedList.includes(number);
}



// Tangani perintah ban & unban
async function handleBanCommands(msg, senderNumber, text) {
  const args = text.split(' ');
  const command = args[0];
  const target = args[1];
const adminList = ['6281292744550, 6287884859865']; // nomor admin

  console.log('🔍 [BAN] SenderNumber:', senderNumber);
  console.log('🔍 [BAN] AdminList:', adminList);

if (!adminList.includes(senderNumber)) {
  await msg.reply('   ^}^l Kamu tidak diizinkan menggunakan perintah ini.');
  return;
}


  if (!target) {
    await msg.reply('❗ Masukkan nomor target. Contoh: `!ban 628xxxx`');
    return;
  }

  if (command === '!ban') {
    if (isBanned(target)) {
      await msg.reply(`⚠️ Nomor ${target} sudah diban.`);
    } else {
      bannedList.push(target);
      saveBanned(bannedList);
      await msg.reply(`✅ Nomor ${target} berhasil diban.`);
    }
  }

  if (command === '!unban') {
    if (!isBanned(target)) {
      await msg.reply(`⚠️ Nomor ${target} tidak ada dalam daftar ban.`);
    } else {
      bannedList = bannedList.filter(n => n !== target);
      saveBanned(bannedList);
      await msg.reply(`✅ Nomor ${target} berhasil di-unban.`);
    }
  }
}

module.exports = {
  isBanned,
  handleBanCommands
};
