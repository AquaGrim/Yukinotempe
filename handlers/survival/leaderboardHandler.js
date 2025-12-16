const { loadUsers } = require("./utils");

async function leaderboardHandler(msg) {
  const users = loadUsers();
  const userArr = Object.entries(users).filter(([_, u]) => u.registered);
  if (userArr.length === 0) {
    return msg.reply("   ^}^r Belum ada pemain yang terdaftar.");
  }
  // Sort hanya field yang diperlukan
  userArr.sort(([, a], [, b]) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.exp - a.exp;
  });
  let text = `   ^|^t🏆 *LEADERBOARD TOP 10 SURVIVAL*\n\n`;
  for (let i = 0; i < Math.min(10, userArr.length); i++) {
    const [number, user] = userArr[i];
    text += `*${i + 1}. ${user.name}*\n   📞 ${number}\n   🔹 Level: ${
      user.level
    }\n   🔹 EXP: ${user.exp}\n   💰 Gold: ${user.money}\n   🍃 Stamina: ${
      user.stamina
    }\n\n`;
  }
  await msg.reply(text.trim());
}

module.exports = leaderboardHandler;
