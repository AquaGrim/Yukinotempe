const { loadUsers, saveUsers } = require('./utils');
const fishList = require('../../data/fishData');

async function fishingHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered) {
    return msg.reply('   ^}^w kamu belum terdaftar. Gunakan !regist Nama | Umur');
  }

  if (user.stamina < 1) {
    return msg.reply('   ^}^r Stamina tidak cukup untuk memancing. Gunakan Potion.');
  }

  if (user.fishing && user.fishing.active) {
    return msg.reply(`   ^|^e ${user.name} sedang memancing... Tunggu hasilnya dulu!`);
  }

  user.stamina -= 1;
  user.fishing = {
    active: true,
    startedAt: Date.now()
  };

  saveUsers(users);
  msg.reply(`   ^=^n   ^=^n    ${user.name} mulai memancing... Tunggu 1 menit untuk hasilnya!`);

  setTimeout(() => {
    const updatedUsers = loadUsers();
    const u = updatedUsers[sender];
    if (!u || !u.fishing?.active) return;

    // Sistem rarity
    const rarityPool = [
      { rarity: 'trash', chance: 0.25 },
      { rarity: 'common', chance: 0.35 },
      { rarity: 'uncommon', chance: 0.2 },
      { rarity: 'rare', chance: 0.16 },
      { rarity: 'epic', chance: 0.02 },
      { rarity: 'legendary', chance: 0.009 },
      { rarity: 'mythic', chance: 0.001 }
    ];


    const rand = Math.random();
    let selectedRarity = 'trash';
    let acc = 0;
    for (const entry of rarityPool) {
      acc += entry.chance;
      if (rand <= acc) {
        selectedRarity = entry.rarity;
        break;
      }
    }

    const candidates = fishList.filter(f => f.rarity === selectedRarity);
    const selectedFish = candidates[Math.floor(Math.random() * candidates.length)];

    // Pastikan inventory berbentuk objek
    if (typeof u.inventory !== 'object' || Array.isArray(u.inventory)) {
      u.inventory = {};
    }

    u.inventory[selectedFish.name] = (u.inventory[selectedFish.name] || 0) + 1;
    u.fishing = { active: false };

    saveUsers(updatedUsers);

    msg.reply(`   ^=^n^i ${u.name} mendapatkan ikan *${selectedFish.name}* (${selectedRarity}) senilai ${selectedFish.price} gold! 🎣`);
  }, 60 * 1000);
}

module.exports = fishingHandler;
