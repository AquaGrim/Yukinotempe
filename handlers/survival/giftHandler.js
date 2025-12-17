const { loadUsers, saveUsers, addItem } = require("./utils");

const adminList = ["6281292744550"]; // Ganti dengan nomor kamu

async function giftHandler(msg) {
  try {
    // Extract nomor dari msg.from (format: 62812345678@c.us)
    const sender = msg.from.split("@")[0];
    if (!adminList.includes(sender)) {
      return msg.reply(
        "   ^}^l Kamu tidak diizinkan menggunakan perintah ini."
      );
    }
    const mentions = await msg.getMentions();
    const args = msg.body.trim().split(" ").slice(1);
    if (mentions.length === 0 || args.length < 3) {
      return msg.reply(
        "   ^}^w Format salah. Contoh:\n!gift @target item jumlah"
      );
    }
    const targetNumber = mentions[0].number;
    const item = args[1];
    const amount = parseInt(args[2]);
    if (!amount || amount <= 0) {
      return msg.reply("   ^}^w Jumlah harus berupa angka lebih dari 0.");
    }
    const users = loadUsers();
    const user = users[targetNumber];
    if (!user || !user.registered) {
      return msg.reply(
        `   ^}^w Pengguna dengan nomor ${targetNumber} belum terdaftar.`
      );
    }
    if (item.toLowerCase() === "money") {
      user.money += amount;
      saveUsers(users);
      return msg.reply(
        `   ^|^e Berhasil memberi ${amount} gold ke ${user.name}.`
      );
    } else {
      addItem(user, item, amount);
      saveUsers(users);
      return msg.reply(
        `   ^|^e Berhasil memberi ${amount} ${item} ke ${user.name}.`
      );
    }
  } catch (error) {
    console.error("[GIFT] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat memberikan gift.");
  }
}

module.exports = giftHandler;
