const axios = require("axios");

async function aiHandler(client, msg) {
  const text = msg.body.trim();
  if (!text.startsWith("!gemini")) return false;

  const pertanyaan = text.replace("!gemini", "").trim();
  if (!pertanyaan) {
    await msg.reply("❗ Silakan tulis pertanyaan setelah !tanya");
    return true;
  }

  try {
    const res = await axios.post("http://127.0.0.1:10045/ask", { message: pertanyaan });
    const jawaban = res.data.reply || "⚠️ Tidak ada jawaban.";
    await msg.reply(jawaban);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await msg.reply("⚠️ Gagal menghubungi AI.");
  }

  return true;
}

module.exports = aiHandler;
