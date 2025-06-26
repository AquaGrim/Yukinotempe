const { loadUsers } = require('./utils');

async function leaderboardHandler(msg) {
  const users = loadUsers();

  // Ubah users menjadi array dan sortir berdasarkan level & exp
  const sorted = Object.entries(users)
    .filter(([_, user]) => user.registered)
    .sort(([, a], [, b]) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.exp - a.exp;
    });

  // Ambil 10 teratas
  const top10 = sorted.slice(0, 10);

  let text = `   ^|^t🏆 *LEADERBOARD TOP 10 SURVIVAL*\n\n`;

  top10.forEach(([number, user], i) => {
    text += `*${i + 1}. ${user.name}*
   📞 ${number}
   🔹 Level: ${user.level}
   🔹 EXP: ${user.exp}
   💰 Gold: ${user.money}
   🍃 Stamina: ${user.stamina}\n\n`;
  });

  if (top10.length === 0) {
    text = '   ^}^r Belum ada pemain yang terdaftar.';
  }

  await msg.reply(text.trim());
}

module.exports = leaderboardHandler;
