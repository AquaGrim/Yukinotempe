const { loadUsers, saveUsers, addExp } = require('./utils');

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 jam

async function dailyHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered || !user.name) {
    return msg.reply('   ^}^w Kamu belum terdaftar. Gunakan !regist Nama | Umur');
  }

  const now = Date.now();
  if (user.lastDaily && now - user.lastDaily < DAILY_COOLDOWN) {
    const remaining = DAILY_COOLDOWN - (now - user.lastDaily);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return msg.reply(`   ^z ${user.name} sudah klaim harian. Coba lagi dalam ${hours} jam ${minutes} menit.`);
  }

  // Hadiah harian
  const goldReward = 200;
  const expReward = 50;
  const potionReward = 1;

  user.money += goldReward;
  const leveled = addExp(user, expReward);
  user.lastDaily = now;

  // Tambah item ke inventory
  if (!user.inventory['Potion']) user.inventory['Potion'] = 0;
  user.inventory['Potion'] += potionReward;

  saveUsers(users);

  let message = `   ^=^n^e Kamu klaim hadiah harian:\n+${goldReward} gold\n+${expReward} EXP\n+${potionReward} Potion`;
  if (leveled) {
    message += `\n   ^=^t ${user.name} naik level ke ${user.level}!`;
  }

  await msg.reply(message);
}

module.exports = dailyHandler;
