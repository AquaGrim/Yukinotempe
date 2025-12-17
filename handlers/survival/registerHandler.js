const { loadUsers, saveUsers } = require("./utils");
const { extractUserNumber } = require("./userExtractor");

async function registerHandler(msg) {
  try {
    console.log("[REGISTER] Command triggered");
    const senderNumber = extractUserNumber(msg);
    console.log("[REGISTER] Extracted sender number:", senderNumber);

    if (!senderNumber) {
      console.log(
        "[REGISTER] ✗ Tidak bisa extract nomor, request pesan pribadi"
      );
      return msg.reply(
        "❌ Tidak bisa mendapatkan nomor user di grup. Silakan kirim pesan pribadi ke bot terlebih dahulu, baru lakukan registrasi!"
      );
    }

    const users = loadUsers();
    const text = msg.body;
    console.log(
      "[REGISTER] User number:",
      senderNumber,
      "Already registered:",
      !!users[senderNumber]?.registered
    );

    if (users[senderNumber]?.registered)
      return msg.reply("   ^=^s^{ Kamu sudah terdaftar.");
    const match = text.match(/^!regist\s+(.+)\s*\|\s*(\d{1,2})$/i);
    if (!match)
      return msg.reply("   ^}^w Format salah. Contoh: !regist Neko | 21");
    const name = match[1].trim();
    const age = parseInt(match[2]);
    if (name.length < 3 || name.length > 20)
      return msg.reply("   ^}^w Nama harus 3-20 karakter.");
    if (age < 10 || age > 99)
      return msg.reply("   ^}^w Umur harus antara 10-99 tahun.");

    console.log(
      "[REGISTER] Creating user:",
      senderNumber,
      "Name:",
      name,
      "Age:",
      age
    );

    users[senderNumber] = {
      registered: true,
      name,
      age,
      money: 100,
      stamina: 10,
      level: 1,
      exp: 0,
      inventory: {},
      lastAdventure: 0,
      lastDaily: "",
      fishing: { active: false },
      misi: { petualang: 0, lawan: 0 },
    };
    saveUsers(users);
    console.log(
      "[REGISTER] ✓ User registered successfully with number:",
      senderNumber
    );

    return msg.reply(
      `   ^|^e Registrasi berhasil!\nNama: *${name}*\nUmur: *${age} tahun*`
    );
  } catch (error) {
    console.error("[REGISTER] Error:", error.message);
    console.error("[REGISTER] Stack:", error.stack);
    return msg.reply("❌ Terjadi kesalahan saat registrasi.");
  }
}

module.exports = registerHandler;
