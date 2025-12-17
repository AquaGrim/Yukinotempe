const { loadUsers, saveUsers } = require("./utils");

async function registerHandler(msg) {
  try {
    console.log("[REGISTER] Command triggered");

    const userId = getSenderNumber(msg);
    console.log("[REGISTER] Sender number:", userId);

    if (!userId) {
      return msg.reply("❌ Tidak bisa membaca nomor pengirim.");
    }

    const users = loadUsers();
    const text = msg.body;

    if (users[userId]?.registered) {
      return msg.reply("Kamu sudah terdaftar.");
    }

    const match = text.match(/^!regist\s+(.+)\s*\|\s*(\d{1,2})$/i);
    if (!match) {
      return msg.reply("Format salah. Contoh: !regist Neko | 21");
    }

    const name = match[1].trim();
    const age = parseInt(match[2]);

    if (name.length < 3 || name.length > 20) {
      return msg.reply("Nama harus 3 sampai 20 karakter.");
    }

    if (age < 10 || age > 99) {
      return msg.reply("Umur harus 10 sampai 99 tahun.");
    }

    users[userId] = {
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

    console.log("[REGISTER] User registered:", userId);

    return msg.reply(`Registrasi berhasil.\nNama: ${name}\nUmur: ${age} tahun`);
  } catch (err) {
    console.error("[REGISTER] Error:", err.message);
    return msg.reply("Terjadi kesalahan saat registrasi.");
  }
}

function getSenderNumber(msg) {
  const rawId = msg.author || msg.from;
  if (!rawId) return null;
  return rawId.split("@")[0];
}

module.exports = registerHandler;
