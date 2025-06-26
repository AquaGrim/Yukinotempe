const { loadUsers, saveUsers } = require('./utils');

async function registerHandler(msg) {
  const sender = await msg.getContact();
  const senderNumber = sender.number;

  const users = loadUsers();
  const text = msg.body;

  if (users[senderNumber]?.registered) {
    return msg.reply('   ^=^s^{ Kamu sudah terdaftar.');
  }

  const match = text.match(/^!regist\s+(.+)\s*\|\s*(\d{1,2})$/i);
  if (!match) {
    return msg.reply('   ^}^w Format salah. Contoh: !regist Neko | 21');
  }

  const name = match[1].trim();
  const age = parseInt(match[2]);

  if (name.length < 3 || name.length > 20) return msg.reply('   ^}^w Nama harus 3-20 karakter.');
  if (age < 10 || age > 99) return msg.reply('   ^}^w Umur harus antara 10-99 tahun.');

  users[senderNumber] = {
    registered: true,
    name,
    age,
    money: 100,
    stamina: 10,
    level: 1,
    exp: 0,
    inventory: {}, // <- inventori sebagai objek
    lastAdventure: 0,
    lastDaily: '',
    fishing: { active: false },
    misi: {
      petualang: 0,
      lawan: 0
    }
  };

  saveUsers(users);
  return msg.reply(`   ^|^e Registrasi berhasil!\nNama: *${name}*\nUmur: *${age} tahun*`);
}

module.exports = registerHandler;
