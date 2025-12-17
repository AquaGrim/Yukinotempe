const { loadUsers, saveUsers, addExp } = require("./utils");

const COOLDOWN_MS = 1 * 60 * 1000; // 3 menit

async function battleHandler(msg) {
  try {
    // Extract nomor user (dari pesan pribadi atau di grup)
    let sender;
    if (!msg.isGroup) {
      sender = msg.from.split("@")[0];
    } else {
      sender = msg.author ? msg.author.split("@")[0] : msg.from.split("@")[0];
    }
    const users = loadUsers();
    const user = users[sender];
    if (!user || !user.registered || !user.name) {
      return msg.reply(
        "   ^}^w Kamu belum terdaftar. Gunakan !regist Nama | Umur"
      );
    }
    const now = Date.now();
    if (user.lastBattle && now - user.lastBattle < COOLDOWN_MS) {
      const remaining = Math.ceil(
        (COOLDOWN_MS - (now - user.lastBattle)) / 1000
      );
      return msg.reply(
        `   ^o    ${user.name} harus menunggu ${Math.ceil(
          remaining / 60
        )} menit lagi untuk bertarung.`
      );
    }
    if (user.stamina < 1) {
      return msg.reply(
        `   ^z    Stamina ${user.name} tidak cukup! Dibutuhkan 1 stamina.`
      );
    }
    user.stamina -= 1;
    user.lastBattle = now;
    let winChance = 0.5;
    if (user.buff) {
      winChance += 0.25;
      user.buff = false;
    }
    let result = `   ^=^x    ${user.name} bertarung dan kalah...`;
    if (Math.random() < winChance) {
      const gold = Math.floor(Math.random() * 40 + 20);
      const exp = Math.floor(Math.random() * 15 + 10);
      user.money += gold;
      const leveled = addExp(user, exp);
      user.misi.lawan += 1;
      user.inventory["Gold Coin"] = (user.inventory["Gold Coin"] || 0) + 1;
      result = `   ^=^o^f ${user.name} menang!\n+${gold} gold, +${exp} EXP`;
      if (leveled) {
        result += `\n   ^=^t    Naik level ke ${user.level}!`;
      }
    }
    saveUsers(users);
    await msg.reply(result);
  } catch (error) {
    console.error("[BATTLE] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat bertarung.");
  }
}

module.exports = battleHandler;
