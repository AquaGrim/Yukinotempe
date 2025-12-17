const { loadUsers, saveUsers, addExp } = require("./utils");

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 jam

async function dailyHandler(msg) {
  try {
    // Extract nomor dari msg.from (format: 62812345678@c.us)
    const sender = msg.from.split("@")[0];
    const users = loadUsers();
    const user = users[sender];
    if (!user || !user.registered || !user.name) {
      return msg.reply(
        "   ^}^w Kamu belum terdaftar. Gunakan !regist Nama | Umur"
      );
    }
    const now = Date.now();
    if (user.lastDaily && now - user.lastDaily < DAILY_COOLDOWN) {
      const remaining = DAILY_COOLDOWN - (now - user.lastDaily);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return msg.reply(
        `   ^z ${user.name} sudah klaim harian. Coba lagi dalam ${hours} jam ${minutes} menit.`
      );
    }
    // Hadiah harian
    const goldReward = 200,
      expReward = 50,
      potionReward = 1;
    user.money += goldReward;
    const leveled = addExp(user, expReward);
    user.lastDaily = now;
    user.inventory["Potion"] = (user.inventory["Potion"] || 0) + potionReward;
    saveUsers(users);
    let message = `   ^=^n^e Kamu klaim hadiah harian:\n+${goldReward} gold\n+${expReward} EXP\n+${potionReward} Potion`;
    if (leveled)
      message += `\n   ^=^t ${user.name} naik level ke ${user.level}!`;
    await msg.reply(message);
  } catch (error) {
    console.error("[DAILY] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat klaim harian.");
  }
}

module.exports = dailyHandler;
