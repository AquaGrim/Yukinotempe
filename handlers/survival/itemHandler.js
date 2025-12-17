const { loadUsers, saveUsers, addExp } = require("./utils");

async function useItemHandler(msg) {
  try {
    // Extract nomor dari msg.from (format: 62812345678@c.us)
    const sender = msg.from.split("@")[0];
    const users = loadUsers();
    const user = users[sender];
    const args = msg.body.trim().split(" ").slice(1);
    if (args.length === 0)
      return msg.reply("Gunakan:\n- !pakai [item] [jumlah/all]\n- !pakai all");
    const itemMap = {
      potion: "Potion",
      "gold coin": "Gold Coin",
      "buff scroll": "Buff Scroll",
      "exp book": "Exp Book",
    };
    const firstArg = args[0]?.toLowerCase();
    // !pakai all → pakai semua item
    if (firstArg === "all") {
      let anyUsed = false;
      for (const itemName of Object.values(itemMap)) {
        const qty = user.inventory[itemName] || 0;
        if (qty > 0) {
          await applyItemEffect(user, itemName, qty, msg);
          user.inventory[itemName] -= qty;
          if (user.inventory[itemName] <= 0) delete user.inventory[itemName];
          anyUsed = true;
        }
      }
      if (!anyUsed)
        return msg.reply("   ^}^l Kamu tidak punya item yang bisa digunakan.");
      saveUsers(users);
      return;
    }
    // !pakai <item> <jumlah/all>
    let quantity = 1;
    const lastArg = args[args.length - 1];
    const isUseAll = lastArg?.toLowerCase() === "all";
    if (isUseAll) args.pop();
    else if (!isNaN(parseInt(lastArg))) quantity = parseInt(args.pop());
    const itemKey = args.join(" ").toLowerCase();
    const itemName = itemMap[itemKey];
    if (!itemName)
      return msg.reply("   ^}^s Item tidak dikenali atau belum didukung.");
    const itemQty = user.inventory[itemName] || 0;
    if (itemQty <= 0) return msg.reply(`   ^}^l Kamu tidak punya ${itemName}.`);
    if (isUseAll) quantity = itemQty;
    if (itemQty < quantity)
      return msg.reply(`   ^}^l Kamu hanya punya ${itemQty} ${itemName}.`);
    user.inventory[itemName] -= quantity;
    if (user.inventory[itemName] <= 0) delete user.inventory[itemName];
    await applyItemEffect(user, itemName, quantity, msg);
    saveUsers(users);
  } catch (error) {
    console.error("[ITEM] Error:", error.message);
    return msg.reply("❌ Terjadi kesalahan saat menggunakan item.");
  }
}

async function applyItemEffect(user, itemName, quantity, msg) {
  switch (itemName) {
    case "Potion":
      const staminaGain = 3 * quantity;
      user.stamina += staminaGain;
      return msg.reply(
        `   ^=^n^e ${user.name} menggunakan ${quantity} Potion. +${staminaGain} Stamina`
      );
    case "Gold Coin":
      const goldGain = 125 * quantity;
      user.money += goldGain;
      return msg.reply(
        `   ^=^r ${user.name} menggunakan ${quantity} Gold Coin. +${goldGain} Gold`
      );
    case "Buff Scroll":
      user.buff = true;
      return msg.reply(
        `   ^|^e ${user.name} menggunakan ${quantity} Buff Scroll. Peluang menang meningkat untuk pertarungan berikutnya.`
      );
    case "Exp Book":
      const expGain = 50 * quantity;
      const leveled = addExp(user, expGain);
      let msgText = `   ^=^w ${user.name} menggunakan ${quantity} Exp Book. +${expGain} EXP`;
      if (leveled) msgText += `\n   ^=^t Naik level ke ${user.level}!`;
      return msg.reply(msgText);
    default:
      return msg.reply(`   ^}^s Efek dari ${itemName} belum didukung.`);
  }
}

module.exports = useItemHandler;
