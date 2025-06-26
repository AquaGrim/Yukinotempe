const axios = require("axios");

const API_KEY = "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";

async function llamaHandler(msg) {
  const text = msg.body.trim();

  // Perintah khusus: !llama [pertanyaan]
  if (!text.toLowerCase().startsWith("!llama")) return false;

  const prompt = text.slice(6).trim();
  if (!prompt && !msg.hasMedia) {
    return msg.reply("❗ Kirim: !llama <pertanyaan> atau reply ke gambar.");
  }

  let messages = [
    {
      role: "user",
      content: []
    }
  ];

  // Jika user memberikan teks
  if (prompt) {
    messages[0].content.push({ type: "text", text: prompt });
  }

  // Jika user reply ke gambar (atau kirim gambar langsung)
  if (msg.hasMedia) {
    try {
      const media = await msg.downloadMedia();
      const base64 = `data:${media.mimetype};base64,${media.data}`;

      messages[0].content.push({
        type: "image_url",
        image_url: {
          url: base64
        }
      });
    } catch (e) {
      console.error("❌ Gagal ambil media:", e);
      return msg.reply("❌ Gagal mengambil gambar.");
    }
  }

  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: messages
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://yourdomain.com",
          "X-Title": "WA-LLaMA-Bot"
        }
      }
    );

    const reply = res.data.choices?.[0]?.message?.content || "❌ Tidak ada balasan dari LLaMA.";
    await msg.reply(reply);
    return true;
  } catch (err) {
    console.error("❌ LLaMA API Error:", err.response?.data || err.message);
    return msg.reply("❌ Gagal memproses permintaan AI.");
  }
}

module.exports = llamaHandler;
