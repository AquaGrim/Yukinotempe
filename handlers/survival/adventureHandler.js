const { loadUsers, saveUsers, addExp, addItem } = require('./utils');

async function adventureHandler(msg) {
  const contact = await msg.getContact();
  const senderNumber = contact.number;

  const users = loadUsers();
  const user = users[senderNumber];

  if (!user || !user.registered) {
    return msg.reply(`   ^}^w ${user?.name || 'Pengguna'} belum terdaftar. Gunakan perintah: !regist Nama | Umur`);
  }

  const now = Date.now();
  const cooldown = 1 * 60 * 1000; // 1 menit cooldown

  if (user.lastAdventure && now - user.lastAdventure < cooldown) {
    const remaining = Math.ceil((cooldown - (now - user.lastAdventure)) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return msg.reply(`   ^o ${user.name} harus menunggu ${minutes}m ${seconds}s lagi untuk berpetualang.`);
  }

  if (user.stamina < 3) {
    return msg.reply(`   ^}^w Stamina ${user.name} habis. Gunakan potion atau tunggu.`);
  }

  // Reward acak
  const coin = Math.floor(Math.random() * 50) + 10;
  const dapatPotion = Math.random() < 0.3;
  const dapatScroll = Math.random() < 0.3;
  const dapatExpBook = Math.random() < 0.01;

  user.money += coin;
  user.stamina -= 3;
  const leveledUp = addExp(user, 20);
  if (dapatPotion) addItem(user, 'Potion', 1);
  if (dapatScroll) addItem(user, 'Buff Scroll', 1);
  if (dapatExpBook) addItem(user, 'Exp Book', 1);

  user.lastAdventure = now;
  saveUsers(users);

  let reply = `   ^=^w ^o ${user.name} berpetualang dan mendapat ${coin} koin, 20 EXP.`;
  if (dapatPotion) reply += `\n   ^=^n^a ${user.name} menemukan 1 Potion!`;
  if (dapatScroll) reply += `\n   ^=^n^a ${user.name} menemukan 1 Buff Scroll!`;
  if (dapatExpBook) reply += `\n   ^=^n^a ${user.name} menemukan 1 Exp Book!`;
  if (leveledUp) reply += `\n   ^=^t ${user.name} naik ke level ${user.level}!`;

  return msg.reply(reply);
}

module.exports = adventureHandler;
