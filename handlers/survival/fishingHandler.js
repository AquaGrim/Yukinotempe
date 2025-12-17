const { loadUsers, saveUsers } = require("./utils");
const fishList = require("../../data/fishData");

// Mode baru: 1. !mancing untuk mulai, 2. !mancing hasil untuk klaim hasil setelah 1 menit
async function fishingHandler(msg) {
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
        "   ^}^w kamu belum terdaftar. Gunakan !regist Nama | Umur"
      );
    }

    const args = msg.body.trim().split(" ");
    const isClaim = args.length > 1 && args[1].toLowerCase() === "hasil";

    // Klaim hasil pancingan
    if (isClaim) {
      if (!user.fishing || !user.fishing.active) {
        return msg.reply(
          "   ^}^w Kamu belum memulai memancing. Gunakan !mancing"
        );
      }
      const elapsed = Date.now() - user.fishing.startedAt;
      if (elapsed < 60 * 1000) {
        const sisa = Math.ceil((60 * 1000 - elapsed) / 1000);
        return msg.reply(
          `   ^|^e Hasil pancingan belum siap. Tunggu ${sisa} detik lagi!`
        );
      }

      // Sistem rarity
      const rarityPool = [
        { rarity: "trash", chance: 0.25 },
        { rarity: "common", chance: 0.35 },
        { rarity: "uncommon", chance: 0.2 },
        { rarity: "rare", chance: 0.16 },
        { rarity: "epic", chance: 0.02 },
        { rarity: "legendary", chance: 0.009 },
        { rarity: "mythic", chance: 0.001 },
      ];
      const rand = Math.random();
      let selectedRarity = "trash";
      let acc = 0;
      for (const entry of rarityPool) {
        acc += entry.chance;
        if (rand <= acc) {
          selectedRarity = entry.rarity;
          break;
        }
      }
      const candidates = fishList.filter((f) => f.rarity === selectedRarity);
      const selectedFish =
        candidates[Math.floor(Math.random() * candidates.length)];
      if (typeof user.inventory !== "object" || Array.isArray(user.inventory)) {
        user.inventory = {};
      }
      user.inventory[selectedFish.name] =
        (user.inventory[selectedFish.name] || 0) + 1;
      user.fishing = { active: false };
      saveUsers(users);
      return msg.reply(
        `   ^=^n^i ${user.name} mendapatkan ikan *${selectedFish.name}* (${selectedRarity}) senilai ${selectedFish.price} gold! 🎣`
      );
    }

    // Mulai memancing
    if (user.stamina < 1) {
      return msg.reply(
        "   ^}^r Stamina tidak cukup untuk memancing. Gunakan Potion."
      );
    }
    if (user.fishing && user.fishing.active) {
      return msg.reply(
        `   ^|^e ${user.name} sedang memancing... Gunakan !mancing hasil untuk klaim hasil!`
      );
    }
    user.stamina -= 1;
    user.fishing = {
      active: true,
      startedAt: Date.now(),
    };
    saveUsers(users);
    return msg.reply(
      `   ^=^n   ^=^n    ${user.name} mulai memancing... Gunakan !mancing hasil setelah 1 menit untuk klaim hasil!`
    );
  } catch (error) {
    console.error("[FISHING] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat memancing.");
  }
}

module.exports = fishingHandler;
