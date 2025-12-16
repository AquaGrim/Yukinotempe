const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
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
      const canvasWidth = 512,
        canvasHeight = 512;
      const padding = 20;
      const bgColor = "#fefefe";
      const fillColor = "#333";
      const fontFamily = "Courier New, monospace";

      // Pecah teks menjadi kata
      const words = overlayText.split(/\s+/);
      const maxWidth = canvasWidth - 2 * padding;
      let fontSize = 100;

      // Approximate char width (monospaced)
      const charWidth = fontSize * 0.6;
      let lines = [];
      let currentLine = "";
      for (let word of words) {
        const testLine = currentLine ? currentLine + " " + word : word;
        const testWidth = testLine.length * charWidth;
        if (testWidth < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Resize fontSize if needed (vertically)
      while (
        lines.length * fontSize * 1.2 > canvasHeight - 2 * padding &&
        fontSize > 10
      ) {
        fontSize -= 2;
        let charWidth = fontSize * 0.6;
        // Re-wrap with new font size
        lines = [];
        currentLine = "";
        for (let word of words) {
          const testLine = currentLine ? currentLine + " " + word : word;
          const testWidth = testLine.length * charWidth;
          if (testWidth < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
      }

      const lineHeight = fontSize * 1.2;
      const yStart = padding + fontSize;

      let svgLines = "";
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const wordsInLine = line.trim().split(/\s+/);
        const spaceCount = wordsInLine.length - 1;
        const wordWidths = wordsInLine.map((w) => w.length * charWidth);
        const totalWordsWidth = wordWidths.reduce((a, b) => a + b, 0);
        const spaceWidth =
          spaceCount > 0 ? (maxWidth - totalWordsWidth) / spaceCount : 0;

        let x = padding;
        for (let j = 0; j < wordsInLine.length; j++) {
          svgLines += `<tspan x="${x.toFixed(1)}" y="${(
            yStart +
            i * lineHeight
          ).toFixed(1)}">${wordsInLine[j]}</tspan>\n`;
          x += wordWidths[j] + spaceWidth;
        }
      }

      const svgImage = `
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text font-size="${fontSize}" font-family="${fontFamily}" fill="${fillColor}">
        ${svgLines}
      </text>
    </svg>
  `;

      const sharp = require("sharp");
      const { MessageMedia } = require("whatsapp-web.js");

      const stickerBufferWebp = await sharp(Buffer.from(svgImage))
        .webp({ quality: 95 })
        .toBuffer();

      const stickerMedia = new MessageMedia(
        "image/webp",
        stickerBufferWebp.toString("base64"),
        "brat.webp"
      );

      await msg.reply(stickerMedia, null, { sendMediaAsSticker: true });
      return true;
    }

    // ============================
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
        await sharp(tempInput)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 90 })
          .toFile(tempOutput);
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
        console.error("[CONVERT] Sharp conversion failed:", error);
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
