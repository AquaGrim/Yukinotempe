const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

module.exports = async function downloaderHandler(client, msg) {
  const text = msg.body.trim();

  // === YouTube ===
  if (text.startsWith("!yt ")) {
    const url = text.replace("!yt", "").trim();
    const ytVideoPath = path.join(__dirname, "../temp/youtube_video.mp4");
    const cookiesPath = path.join(__dirname, "../cookies.txt");

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      await msg.reply("❌ URL YouTube tidak valid.");
      return true;
    }

    await msg.reply("⏳ Mengunduh video YouTube...");

const command = `yt-dlp --force-generic-extractor -f "best[ext=mp4]/best" --cookies "${cookiesPath}" -o "${ytVideoPath}" "${url}"`;

    exec(command, async (error) => {
      if (error || !fs.existsSync(ytVideoPath)) {
        console.error("yt-dlp error:", error);
        await msg.reply("❌ Gagal mengunduh video.");
        return;
      }

      const media = MessageMedia.fromFilePath(ytVideoPath);
      await msg.reply(media, null, { caption: "🎬 Video YouTube berhasil diunduh!" });
      fs.unlinkSync(ytVideoPath);
    });

    return true;
  }

  // === TikTok ===
  if (text.startsWith("!tt ")) {
    const url = text.replace("!tt", "").trim();
    const ttVideoPath = path.join(__dirname, "../temp/tiktok_video.mp4");

    if (!url.includes("tiktok.com")) {
      await msg.reply("❌ URL TikTok tidak valid.");
      return true;
    }

    await msg.reply("⏳ Mengunduh video TikTok...");

    try {
      const res = await axios.get(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data?.data?.nowm || res.data?.data?.play;

      if (!videoUrl) {
        await msg.reply("❌ Gagal mendapatkan link video.");
        return true;
      }

      const videoData = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(ttVideoPath, videoData.data);

      const media = MessageMedia.fromFilePath(ttVideoPath);
      await msg.reply(media, null, { caption: "🎵 Video TikTok berhasil diunduh!" });
      fs.unlinkSync(ttVideoPath);
    } catch (error) {
      console.error("TikTok error:", error);
      await msg.reply("❌ Gagal mengunduh video TikTok.");
    }

    return true;
  }

  return false;
};
