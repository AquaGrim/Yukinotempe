const { loadUsers, saveUsers } = require('./utils');
const fishList = require('../../data/fishData');
const itemList = require('../../data/itemjual');

async function sellHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered) {
    return msg.reply('   ^}^w Kamu belum terdaftar. Gunakan !regist Nama | Umur');
  }

  const args = msg.body.trim().split(' ').slice(1);

  if (args.length === 0) {
    return msg.reply(`Gunakan:
- !jual semua    ^f^r menjual semua item dan ikan
- !jual [nama item] [jumlah]    ^f^r contoh: !jual lele 2`);
  }

  const sellables = [...fishList, ...itemList];

  // -----------------------
  // JUAL SEMUA
  // -----------------------
  if (args[0].toLowerCase() === 'semua') {
    let totalGold = 0;
    let sold = {};

    for (const item of sellables) {
      const count = user.inventory[item.name] || 0;
      if (count > 0) {
        totalGold += count * item.price;
        sold[item.name] = count;
        delete user.inventory[item.name];
      }
    }

    if (totalGold === 0) {
      return msg.reply('   ^}^l Kamu tidak punya item untuk dijual.');
    }

    user.money += totalGold;
    saveUsers(users);

    let reply = `   ^=^f   ^=^p^= Kamu menjual:\n`;
    for (const [name, count] of Object.entries(sold)) {
      const item = sellables.find(i => i.name === name);
      reply += `- ${name} x${count} = ${count * item.price} gold\n`;
    }
    reply += `\nTotal: ${totalGold} gold    ^=^r   `;
    return msg.reply(reply);
  }

  // -----------------------
  // JUAL ITEM TERTENTU
  // -----------------------
  const qty = parseInt(args[args.length - 1]);
  const amount = isNaN(qty) ? 1 : qty;
  const nameRaw = isNaN(qty) ? args.join(' ') : args.slice(0, -1).join(' ');
  const itemData = sellables.find(i => i.name.toLowerCase() === nameRaw.toLowerCase());

  if (!itemData) {
    return msg.reply(`   ^}^l Item '${nameRaw}' tidak ditemukan dalam daftar jual.`);
  }

  const owned = user.inventory[itemData.name] || 0;
  if (owned < amount) {
    return msg.reply(`   ^}^l Kamu hanya punya ${owned} ${itemData.name}.`);
  }

  // Kurangi dari inventory
  user.inventory[itemData.name] -= amount;
  if (user.inventory[itemData.name] <= 0) {
    delete user.inventory[itemData.name];
  }

  const earned = amount * itemData.price;
  user.money += earned;
  saveUsers(users);

  return msg.reply(`   ^o Kamu menjual ${amount} ${itemData.name} dan mendapat ${earned} gold.`);
}

module.exports = sellHandler;
