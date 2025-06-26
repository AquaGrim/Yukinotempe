const { loadUsers, saveUsers } = require('./utils');

const shopItems = {
  potion: { name: 'Potion', price: 100, desc: '+3 Stamina' },
  buff: { name: 'Buff Scroll', price: 75, desc: '+25% peluang menang di !lawan' },
  expbook: { name: 'Exp Book', price: 150, desc: '+50 EXP langsung' }
};

async function shopHandler(msg) {
  let text = '*🛒 Toko Item*\n\n';
  for (const [key, item] of Object.entries(shopItems)) {
    text += `🔹 ${item.name} - ${item.price} gold → !beli ${key}
`;
  }
  await msg.reply(text);
}

async function buyHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  const args = msg.body.trim().split(' ');
  const itemKey = args[1]?.toLowerCase();
  const quantity = parseInt(args[2]) || 1;

  const item = shopItems[itemKey];
  if (!item) return msg.reply('   ^}^l Item tidak ditemukan. Coba !toko');
  if (quantity < 1 || isNaN(quantity)) return msg.reply('   ^}^r Jumlah item tidak valid.');

  const totalPrice = item.price * quantity;
  if (user.money < totalPrice) {
    return msg.reply(`   ^}^r Uangmu tidak cukup. Harga total: ${totalPrice} gold.`);
  }

  user.money -= totalPrice;

  // Tambahkan ke inventory (versi objek)
  user.inventory[item.name] = (user.inventory[item.name] || 0) + quantity;

  saveUsers(users);
  await msg.reply(`   ^|^e Kamu membeli *${quantity} ${item.name}* seharga *${totalPrice} gold*.`);
}


module.exports = { shopHandler, buyHandler };
