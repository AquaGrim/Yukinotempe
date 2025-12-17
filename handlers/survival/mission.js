const { loadUsers } = require("./utils");

async function missionHandler(msg) {
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
    if (!user || !user.registered) {
      return msg.reply("❗ Kamu belum terdaftar.");
    }
    const misi = user.misi || { petualang: 0, lawan: 0 };
    const text = `🎯 *Progress Misi Harian*\n🗺️ Petualangan: ${misi.petualang}/5\n⚔️ Menang battle: ${misi.lawan}/3`;
    await msg.reply(text);
  } catch (error) {
    console.error("[MISSION] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat mengakses misi.");
  }
}

module.exports = missionHandler;
