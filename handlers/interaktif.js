async function interaktifHandler(client, msg) {
  const text = msg.body.trim().toLowerCase();

  if (text === "!halo") {
    await msg.reply("Halo juga! 👋 Saya bot interaktif.");
    return true;
  }

  if (text === "!waktu") {
    const waktu = new Date().toLocaleString();
    await msg.reply(`🕒 Waktu sekarang: ${waktu}`);
    return true;
  }

  if (text === "!menu" || text === "!help" || text === "yukino") {
const menu = `
   ^=   ^v *MENU BOT WHATSAPP*    ^=   ^v

📌 *Fitur Umum & Interaktif*
• !halo                 - Balasan sapaan
• !waktu               - Cek waktu lokal
• !menu                - Tampilkan menu ini

🎨 *Fitur Stiker*
• !sticker             - Ubah gambar ke stiker
• !stikertogambar      - Ubah stiker ke gambar
• !gambar              - Sama dengan atas
• #convert             - Auto ubah stiker ke gambar

📚 *Edukasi & Islami*
• !katabijak           - Kata bijak harian
• !kamus [kata]        - Translate kata ke Indonesia
• !ayat                - Ayat Al-Qur’an acak
• !haribesar           - Daftar hari besar nasional

⬇️ *Downloader*
• !yt [url]            - Download YouTube
• !tt [url]            - Download TikTok

📡 *Informasi*
• !cuaca [lokasi]      - Cek cuaca saat ini
• !sholat [lokasi]     - Jadwal sholat
• !kurs                - Kurs nilai tukar
• !qr [teks]           - Generate QR code

👨‍💻 *Developer Tools*
• !run [kode]          - Jalankan kode JS
• !github [repo]       - Cek info GitHub

🤖 *AI Assistant*
• !tanya [pertanyaan]  - Tanya ke AI Chat

💤 *AFK*
• !afk [alasan]        - Aktifkan mode AFK

🧭 *Game Survival RPG*
• !regist [nama|umur]  - Daftar pemain baru
• !profil              - Lihat profil pemain
• !petualang           - Pergi berpetualang
• !mancing             - Mancing ikan
• !daily               - Klaim harian
• !misi                - Cek misi harian
• !toko                - Lihat item di toko
• !beli [item] [qty]   - Beli item dari toko
• !pakai [item] [qty]  - Gunakan item dari inventori
• !gacha [jumlah]      - Gacha hadiah acak
• !lawan               - Lawan musuh
• !jual [ikan/item]    - Jual item/ikan
• !jual semua          - Jual semua ikan
• !gift @tag item qty  - Admin kirim item ke user

_📝 Gunakan awalan "!" untuk semua perintah._
`;

    await msg.reply(menu);
    return true;
  }

  return false;
}

module.exports = interaktifHandler;
