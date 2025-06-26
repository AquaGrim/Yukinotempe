const { loadUsers, saveUsers, addExp } = require('./utils');

const COOLDOWN_MS = 1 * 60 * 1000; // 3 menit

async function battleHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();

  const user = users[sender];
  if (!user || !user.registered || !user.name) {
    return msg.reply('   ^}^w Kamu belum terdaftar. Gunakan !regist Nama | Umur');
  }

  const now = Date.now();

  // Cek cooldown
  if (user.lastBattle && now - user.lastBattle < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - user.lastBattle)) / 1000);
    return msg.reply(`   ^o    ${user.name} harus menunggu ${Math.ceil(remaining / 60)} menit lagi untuk bertarung.`);
  }

  // Cek stamina
  if (user.stamina < 1) {
    return msg.reply(`   ^z    Stamina ${user.name} tidak cukup! Dibutuhkan 1 stamina.`);
  }

  user.stamina -= 1;
  user.lastBattle = now;

  // Kalkulasi buff
  let winChance = 0.5;
  if (user.buff) {
    winChance += 0.25; // buff menambah 25%
    user.buff = false; // hanya berlaku sekali
  }

  const win = Math.random() < winChance;
  let result = `   ^=^x    ${user.name} bertarung dan kalah...`;

  if (win) {
    const gold = Math.floor(Math.random() * 40 + 20);
    const exp = Math.floor(Math.random() * 15 + 10);
    user.money += gold;
    const leveled = addExp(user, exp);
    user.misi.lawan += 1;

    // Tambah ke inventory baru
    if (!user.inventory['Gold Coin']) user.inventory['Gold Coin'] = 0;
    user.inventory['Gold Coin'] += 1;

    result = `   ^=^o^f ${user.name} menang!\n+${gold} gold, +${exp} EXP`;
    if (leveled) {
      result += `\n   ^=^t    Naik level ke ${user.level}!`;
    }
  }

  saveUsers(users);
  await msg.reply(result);
}

module.exports = battleHandler;
