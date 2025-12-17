const { loadUsers, saveUsers } = require("./utils");

/**
 * Ambil nomor WA asli pengirim
 * Grup  -> msg.author (@c.us)
 * Private -> msg.from (@c.us)
 * Tolak @g.us dan @lid
 */
function getRealUserNumber(msg) {
  // Pesan dari grup
  if (msg.author && msg.author.endsWith("@c.us")) {
    return msg.author.split("@")[0];
  }

  // Pesan private
  if (msg.from && msg.from.endsWith("@c.us")) {
    return msg.from.split("@")[0];
  }

  return null;
}

async function registerHandler(msg) {
  try {
    console.log("[REGISTER] Command triggered");

    const userId = getRealUserNumber(msg);
    console.log("[REGISTER] Real user number:", userId);

    if (!userId) {
      return msg.reply(
        "Registrasi gagal. Kirim perintah ini lewat chat pribadi ke bot."
      );
    }

    const users = loadUsers();
    const text = msg.body;

    // Sudah terdaftar
    if (users[userId]?.registered) {
      return msg.reply("Kamu sudah terdaftar.");
    }

    // Validasi format
    const match = text.match(/^!regist\s+(.+)\s*\|\s*(\d{1,2})$/i);
    if (!match) {
      return msg.reply("Format salah. Contoh: !regist Neko | 21");
    }

    const name = match[1].trim();
    const age = parseInt(match[2], 10);

    if (name.length < 3 || name.length > 20) {
      return msg.reply("Nama harus 3 sampai 20 karakter.");
    }

    if (age < 10 || age > 99) {
      return msg.reply("Umur harus 10 sampai 99 tahun.");
    }

    // Simpan user
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

module.exports = registerHandler;
