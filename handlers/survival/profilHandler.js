const { loadUsers } = require('./utils');

async function profileHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered) {
    return msg.reply('❌ Kamu belum terdaftar. Gunakan *!regist Nama | Umur*');
  }

  // Format inventori
  let inventoryText = '📦 Kosong';
  if (user.inventory && typeof user.inventory === 'object' && Object.keys(user.inventory).length > 0) {
    inventoryText = Object.entries(user.inventory)
      .map(([item, count]) => `• ${item} x${count}`)
      .join('\n');
  }

  const profileText = `
🎖️ *Profil ${user.name || 'Tanpa Nama'}*

👤 Nama     : ${user.name || '-'}
🎂 Umur     : ${user.age || '-'}
📈 Level    : ${user.level}
🧪 EXP      : ${user.exp} / ${(user.level + 1) * 50}
💰 Gold     : ${user.money}
⚡ Stamina  : ${user.stamina}

🎒 *Inventori:*
${inventoryText}
`.trim();

  await msg.reply(profileText);
}

module.exports = profileHandler;
