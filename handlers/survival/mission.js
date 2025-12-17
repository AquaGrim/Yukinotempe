const { loadUsers } = require("./utils");

async function missionHandler(msg) {
  try {
    // Extract nomor dari msg.from (format: 62812345678@c.us)
    const sender = msg.from.split("@")[0];
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
