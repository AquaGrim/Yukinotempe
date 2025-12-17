const { loadUsers, saveUsers, addItem } = require("./utils");

async function gachaHandler(msg) {
  try {
    // Extract nomor dari msg.from (format: 62812345678@c.us)
    const sender = msg.from.split("@")[0];
    const users = loadUsers();
    const user = users[sender];
    if (!user || !user.registered) {
      return msg.reply(
        "   ^}^w Kamu belum terdaftar. Gunakan perintah: !regist Nama | Umur"
      );
    }
    const args = msg.body.trim().split(" ");
    const jumlahGacha = parseInt(args[1]) || 1;
    const costPerRoll = 50;
    const totalCost = jumlahGacha * costPerRoll;
    if (user.money < totalCost) {
      return msg.reply(
        `   ^=^r Uang ${user.name} tidak cukup untuk melakukan ${jumlahGacha} gacha. Total: ${totalCost} gold`
      );
    }
    user.money -= totalCost;
    let dapat = {
      Potion: 0,
      "Gold Coin": 0,
      "Buff Scroll": 0,
      Kazuha: 0,
      Furina: 0,
      "Raiden Shogun": 0,
      "Kamisato Ayato": 0,
      Tartaglia: 0,
      "Vestia Zeta": 0,
      Sakura: 0,
      "mythia batford": 0,
      "Gwar Gura": 0,
      "Monkey D. Luffy": 0,
      "Nephie Phelia": 0,
      "Mie Ayam": 0,
      Nothing: 0,
    };
    for (let i = 0; i < jumlahGacha; i++) {
      const chance = Math.random();
      let reward = "Nothing";
      if (chance < 0.2) reward = "Potion";
      else if (chance < 0.35) reward = "Gold Coin";
      else if (chance < 0.55) reward = "Buff Scroll";
      else if (chance < 0.551) reward = "Kazuha";
      else if (chance < 0.5511) reward = "Furina";
      else if (chance < 0.5512) reward = "Raiden Shogun";
      else if (chance < 0.5513) reward = "Kamisato Ayato";
      else if (chance < 0.5514) reward = "Tartaglia";
      else if (chance < 0.5515) reward = "Vestia Zeta";
      else if (chance < 0.5516) reward = "Sakura";
      else if (chance < 0.5517) reward = "mythia batford";
      else if (chance < 0.5518) reward = "Gwar Gura";
      else if (chance < 0.5519) reward = "Monkey D. Luffy";
      else if (chance < 0.552) reward = "Nephie Phelia";
      else if (chance < 0.56) reward = "Mie Ayam";
      dapat[reward]++;
      if (reward !== "Nothing") addItem(user, reward, 1);
    }
    saveUsers(users);
    let replyMsg = `🎰 *${user.name} melakukan ${jumlahGacha} kali gacha:*\n`;
    const rewardList = [
      ["Potion", "🧪 Potion"],
      ["Gold Coin", "💰 Gold Coin"],
      ["Buff Scroll", "📜 Buff Scroll"],
      ["Kazuha", "🎁 Kazuha (Rare!)"],
      ["Furina", "^=^n^a Furina (Epic!)"],
      ["Raiden Shogun", "^=^n^a Raiden Shogun (Epic!)"],
      ["Kamisato Ayato", "^=^n^a Kamisato Ayato (Epic!)"],
      ["Tartaglia", "^=^n^a Tartaglia (Epic!)"],
      ["Vestia Zeta", "^=^n^a Vestia Zeta (Epic!)"],
      ["Sakura", "^=^n^a Sakura (Epic!)"],
      ["mythia batford", "^=^n^a Mythia Batford (Epic!)"],
      ["Gwar Gura", "^=^n^a Gwar Gura (Epic!)"],
      ["Monkey D. Luffy", "^=^n^a Monkey D. Luffy (Epic!)"],
      ["Nephie Phelia", "^=^n^a Nephie Phelia (Epic!)"],
      ["Mie Ayam", "^=^s^| Mie Ayam"],
    ];
    for (const [key, label] of rewardList) {
      if (dapat[key]) replyMsg += `${label} : ${dapat[key]}\n`;
    }
    if (dapat.Nothing) replyMsg += `❌ Tidak Dapat    : ${dapat.Nothing}`;
    await msg.reply(replyMsg.trim());
  } catch (error) {
    console.error("[GACHA] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat melakukan gacha.");
  }
}

module.exports = gachaHandler;
