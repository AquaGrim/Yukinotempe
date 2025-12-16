const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const crypto = require("crypto");

// 🔧 Temp folder (jika belum ada)
const TEMP_DIR = path.join(__dirname, "../temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

/**
 * Menghasilkan nama file temporer berdasarkan waktu dan hash.
 * @param {string} ext - Ekstensi file (misal: .webp, .png, .jpg)
 */
function generateTempFilename(ext = "") {
  const hash = crypto.randomBytes(8).toString("hex");
  return path.join(TEMP_DIR, `${Date.now()}_${hash}${ext}`);
}

/**
 * Menghapus file secara aman.
 * @param  {...string} files - Daftar path file yang akan dihapus.
 */
function cleanFiles(...files) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (err) {
      console.error(`Gagal menghapus file ${file}:`, err);
    }
  }
}

/**
 * Fungsi bantu untuk membungkus teks menjadi beberapa baris berdasarkan jumlah karakter maksimum per baris.
 * @param {string} text - Teks yang akan dibungkus.
 * @param {number} maxChars - Jumlah maksimum karakter per baris.
 * @returns {string[]} Array berisi tiap baris.
 */
function wrapText(text, maxWidth, ctx) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

/**
 * Handler untuk fitur stiker.
 *
 * [NEW] !brat → Text-to-Sticker (latar putih, teks hitam bold, wrapping otomatis)
 * [1] !sticker → Gambar ke Stiker
 * [2] !stikertogambar, !gambar, atau #convert → Stiker ke Gambar
 */
module.exports = async function stickerHandler(client, msg) {
  try {
    // Ambil pesan asli
    const rawText = msg.body ? msg.body.trim() : "";
    const lowerText = rawText.toLowerCase();

    // ============================
    // [NEW] BRAT STIKER (Text-to-Sticker)
    // ============================

    if (rawText.startsWith("!brat")) {
      const overlayText = rawText.slice(5).trim() || "BRAT";

      try {
        // Buat gambar dengan Jimp (latar putih, 512x512)
        const image = new Jimp({
          width: 512,
          height: 512,
          color: 0xffffffff, // White background
        });

        // Gunakan font default Jimp
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        // Split teks ke beberapa baris jika terlalu panjang
        const lines = [];
        const maxCharsPerLine = 20;
        let currentLine = "";

        for (const word of overlayText.split(" ")) {
          if ((currentLine + " " + word).length > maxCharsPerLine) {
            if (currentLine) lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine = currentLine ? currentLine + " " + word : word;
          }
        }
        if (currentLine) lines.push(currentLine.trim());

        // Print teks ke tengah gambar
        const startY = Math.max(50, (512 - lines.length * 40) / 2);

        for (let i = 0; i < lines.length; i++) {
          const y = Math.round(startY + i * 40);
          image.print({
            font: font,
            x: 50,
            y: y,
            text: lines[i],
            maxWidth: 412,
          });
        }

        // Konversi ke WebP buffer
        const webpBuffer = await image.getBuffer("image/webp");

        const stickerMedia = new MessageMedia(
          "image/webp",
          webpBuffer.toString("base64"),
          "brat.webp"
        );

        await msg.reply(stickerMedia, null, { sendMediaAsSticker: true });
        return true;
      } catch (error) {
        console.error("[BRAT] Error creating brat sticker:", error);
        await msg.reply("❌ Gagal membuat brat stiker.");
        return true;
      }
    } // ============================
    // [1] Gambar ke Stiker (perintah: !sticker)
    // ============================
    if (lowerText === "!sticker") {
      const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
      console.log(`[STICKER] !sticker command received. Target message:`, {
        hasMedia: targetMsg.hasMedia,
        mimetype: targetMsg.mimetype || "undefined",
        type: targetMsg.type || "undefined",
      });
      if (!targetMsg.hasMedia) {
        console.error("[STICKER] Target message does not have media.");
        await msg.reply(
          "❌ Harap reply atau kirim gambar dengan caption `!sticker`."
        );
        return true;
      }
      const media = await targetMsg.downloadMedia();
      if (!media) {
        console.error(
          "[STICKER] Failed to download media from target message."
        );
        await msg.reply("⚠️ Gagal mengambil media.");
        return true;
      }
      if (media.mimetype) {
        if (!media.mimetype.includes("image")) {
          console.error(
            "[STICKER] Downloaded media is not an image, mimetype:",
            media.mimetype
          );
          await msg.reply(
            "❌ Harap reply atau kirim gambar dengan caption `!sticker`."
          );
          return true;
        }
      } else {
        console.warn(
          "[STICKER] media.mimetype not available; assuming media is an image."
        );
      }
      console.log(
        "[STICKER] Media successfully downloaded, sending as sticker."
      );
      await msg.reply(media, null, { sendMediaAsSticker: true });
      console.log("[STICKER] Sticker sent.");
      return true;
    }

    // ============================
    // [2] Sticker ke Gambar (perintah: !stikertogambar, !gambar, atau #convert)
    // ============================
    const convertTriggers = ["!stikertogambar", "!gambar", "#convert"];
    const isConvertTrigger = convertTriggers.some(
      (trigger) =>
        lowerText === trigger ||
        lowerText.startsWith(trigger) ||
        lowerText.includes(trigger)
    );
    if (isConvertTrigger) {
      let stickerMsg;
      if (msg.hasQuotedMsg) {
        stickerMsg = await msg.getQuotedMessage();
      } else if (msg.type === "sticker") {
        stickerMsg = msg;
      }
      if (!stickerMsg) {
        console.error("[CONVERT] No sticker message found for conversion.");
        await msg.reply(
          "❌ Harap reply ke stiker yang ingin dikonversi atau kirim stiker dengan trigger konversi."
        );
        return true;
      }
      if (!stickerMsg.hasMedia || stickerMsg.type !== "sticker") {
        console.error("[CONVERT] The replied message is not a sticker.", {
          hasMedia: stickerMsg.hasMedia,
          type: stickerMsg.type,
        });
        await msg.reply("❌ Pesan yang direply bukan stiker.");
        return true;
      }
      console.log("[CONVERT] Sticker message found; beginning conversion.");
      const media = await stickerMsg.downloadMedia();
      if (!media || !media.data) {
        console.error("[CONVERT] Failed to download sticker media.");
        await msg.reply("❌ Tidak dapat mengunduh stiker.");
        return true;
      }
      const ext =
        stickerMsg.mimetype && stickerMsg.mimetype.includes("webp")
          ? ".webp"
          : ".png";
      const tempInput = generateTempFilename(ext);
      const tempOutput = generateTempFilename(".jpg");
      fs.writeFileSync(tempInput, Buffer.from(media.data, "base64"));
      console.log(
        "[CONVERT] Sticker data written to temporary file:",
        tempInput
      );
      try {
        // Gunakan Jimp untuk konversi
        const image = await Jimp.read(tempInput);

        // Flatten dengan white background
        const whiteBackground = new Jimp({
          width: image.bitmap.width,
          height: image.bitmap.height,
          color: 0xffffffff,
        });

        whiteBackground.composite(image, 0, 0);

        // Simpan sebagai JPEG
        await whiteBackground.write(tempOutput);

        console.log(
          "[CONVERT] File successfully converted to JPEG:",
          tempOutput
        );
        const outputBase64 = fs.readFileSync(tempOutput).toString("base64");
        const outputMedia = new MessageMedia(
          "image/jpeg",
          outputBase64,
          "converted.jpg"
        );
        await msg.reply(outputMedia, null, {
          caption: "🖼️ Stiker berhasil dikonversi ke gambar.",
        });
        console.log("[CONVERT] Converted image sent.");
      } catch (error) {
        console.error("[CONVERT] Jimp conversion failed:", error);
        await msg.reply("❌ Gagal mengkonversi stiker ke gambar.");
      } finally {
        cleanFiles(tempInput, tempOutput);
        console.log("[CONVERT] Temporary files cleaned up.");
      }
      return true;
    }

    return false; // Message is not handled by sticker features.
  } catch (err) {
    console.error("[STICKER HANDLER] Error:", err);
    await msg.reply("⚠️ Terjadi kesalahan saat memproses stiker.");
    return true;
  }
};
