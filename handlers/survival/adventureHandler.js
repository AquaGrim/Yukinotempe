const { loadUsers, saveUsers, addExp, addItem } = require("./utils");

async function adventureHandler(msg) {
  try {
    // Extract nomor user (dari pesan pribadi atau di grup)
    let senderNumber;
    if (!msg.isGroup) {
      senderNumber = msg.from.split("@")[0];
    } else {
      senderNumber = msg.author
        ? msg.author.split("@")[0]
        : msg.from.split("@")[0];
    }
    const users = loadUsers();
    const user = users[senderNumber];
    if (!user || !user.registered) {
      return msg.reply(
        `   ^}^w ${
          user?.name || "Pengguna"
        } belum terdaftar. Gunakan perintah: !regist Nama | Umur`
      );
    }
    const now = Date.now();
    const cooldown = 1 * 60 * 1000; // 1 menit cooldown
    if (user.lastAdventure && now - user.lastAdventure < cooldown) {
      const remaining = Math.ceil(
        (cooldown - (now - user.lastAdventure)) / 1000
      );
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      return msg.reply(
        `   ^o ${user.name} harus menunggu ${minutes}m ${seconds}s lagi untuk berpetualang.`
      );
    }
    if (user.stamina < 3) {
      return msg.reply(
        `   ^}^w Stamina ${user.name} habis. Gunakan potion atau tunggu.`
      );
    }
    // Reward acak
    const coin = Math.floor(Math.random() * 50) + 10;
    let reply = `   ^=^w ^o ${user.name} berpetualang dan mendapat ${coin} koin, 20 EXP.`;
    user.money += coin;
    user.stamina -= 3;
    const leveledUp = addExp(user, 20);
    if (Math.random() < 0.3) {
      addItem(user, "Potion", 1);
      reply += `\n   ^=^n^a ${user.name} menemukan 1 Potion!`;
    }
    if (Math.random() < 0.3) {
      addItem(user, "Buff Scroll", 1);
      reply += `\n   ^=^n^a ${user.name} menemukan 1 Buff Scroll!`;
    }
    if (Math.random() < 0.01) {
      addItem(user, "Exp Book", 1);
      reply += `\n   ^=^n^a ${user.name} menemukan 1 Exp Book!`;
    }
    if (leveledUp)
      reply += `\n   ^=^t ${user.name} naik ke level ${user.level}!`;
    user.lastAdventure = now;
    saveUsers(users);
    return msg.reply(reply);
  } catch (error) {
    console.error("[ADVENTURE] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat berpetualang.");
  }
}

module.exports = adventureHandler;
