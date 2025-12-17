const { loadUsers } = require("./utils");

async function profileHandler(msg) {
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
      return msg.reply(
        "❌ Kamu belum terdaftar. Gunakan *!regist Nama | Umur*"
      );
    }
    let inventoryText = "📦 Kosong";
    if (
      user.inventory &&
      typeof user.inventory === "object" &&
      Object.keys(user.inventory).length > 0
    ) {
      inventoryText = Object.entries(user.inventory)
        .map(([item, count]) => `• ${item} x${count}`)
        .join("\n");
    }
    const profileText = `🎖️ *Profil ${
      user.name || "Tanpa Nama"
    }*\n\n👤 Nama     : ${user.name || "-"}\n🎂 Umur     : ${
      user.age || "-"
    }\n📈 Level    : ${user.level}\n🧪 EXP      : ${user.exp} / ${
      (user.level + 1) * 50
    }\n💰 Gold     : ${user.money}\n⚡ Stamina  : ${
      user.stamina
    }\n\n🎒 *Inventori:*\n${inventoryText}`;
    await msg.reply(profileText);
  } catch (error) {
    console.error("[PROFILE] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat mengakses profil.");
  }
}

module.exports = profileHandler;
