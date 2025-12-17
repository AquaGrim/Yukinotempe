const { loadUsers, saveUsers } = require("./utils");

async function resetMancingHandler(msg) {
  try {
    // Extract nomor user (dari pesan pribadi atau di grup)
    let sender;
    if (!msg.isGroup) {
      sender = msg.from.split("@")[0];
    } else {
      sender = msg.author ? msg.author.split("@")[0] : msg.from.split("@")[0];
    }

    // Ganti nomor admin sesuai milikmu
    const adminNumber = "6281292744550"; // tanpa + dan @c.us

    if (sender !== adminNumber) {
      return msg.reply("   ^}^r Perintah ini hanya untuk admin.");
    }

    const users = loadUsers();
    let count = 0;

    for (const user of Object.values(users)) {
      if (user.fishing && user.fishing.active) {
        user.fishing.active = false;
        count++;
      }
    }

    saveUsers(users);
    return msg.reply(`   ^=^r Status mancing direset untuk ${count} user.`);
  } catch (error) {
    console.error("[RESET_MANCING] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat reset mancing.");
  }
}

module.exports = resetMancingHandler;
