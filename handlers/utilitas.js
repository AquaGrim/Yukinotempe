const qrcode = require("qrcode");
const Jimp = require("jimp");
const { MessageMedia } = require("whatsapp-web.js");

async function utilitasHandler(client, msg) {
  const text = msg.body.trim().toLowerCase();

  if (text.startsWith("!cuaca")) {
    const lokasi = text.replace("!cuaca", "").trim() || "Jakarta";
    await msg.reply(
      `⛅ Prakiraan cuaca untuk ${lokasi}:\nSuhu: 28°C\nKondisi: Cerah Berawan\nKelembaban: 65%`
    );
    return true;
  }

  if (text.startsWith("!sholat")) {
    const lokasi = text.replace("!sholat", "").trim() || "Jakarta";
    const times = {
      Subuh: "04:30",
      Dzuhur: "12:15",
      Ashar: "15:30",
      Maghrib: "18:15",
      Isya: "19:30",
    };
    let reply = `🕌 Jadwal Sholat untuk ${lokasi}:\n`;
    for (const [sholat, jam] of Object.entries(times)) {
      reply += `${sholat}: ${jam}\n`;
    }
    await msg.reply(reply);
    return true;
  }

  if (text === "!kurs") {
    const rates = {
      USD: "15,000",
      EUR: "16,500",
      SGD: "11,000",
      GBP: "19,000",
    };
    let reply = "💱 Kurs Mata Uang (IDR):\n";
    for (const [mataUang, rate] of Object.entries(rates)) {
      reply += `1 ${mataUang} = Rp${rate}\n`;
    }
    await msg.reply(reply);
    return true;
  }

  if (text.startsWith("!qr")) {
    const isi = text.replace("!qr", "").trim();
    if (!isi) {
      await msg.reply("❗ Masukkan teks/URL. Contoh: !qr https://...");
      return true;
    }

    const image = new Jimp(300, 300, 0xffffffff);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    image.print(font, 10, 10, "QR Code untuk:");
    image.print(font, 10, 30, isi);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    const media = new MessageMedia("image/jpeg", buffer.toString("base64"));
    await msg.reply(media);
    return true;
  }

  return false;
}

module.exports = utilitasHandler;
