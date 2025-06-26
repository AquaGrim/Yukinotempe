const axios = require("axios");

const API_KEY = "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";

async function aiHandler(msg) {
  const text = msg.body.trim();

  // Hanya tangani command AI (misal diawali dengan "!ai")
  if (!text.toLowerCase().startsWith("!qwen ")) return false;

  const userPrompt = text.slice(4).trim();
  if (!userPrompt) return msg.reply("❗ Gunakan: !ai <pertanyaan>");

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-235b-a22b:free",
        messages: [
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://yourdomain.com", // opsional
          "X-Title": "MyWA-AI-Bot", // opsional
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "❌ Tidak ada balasan.";
    await msg.reply(reply);

    return true;
  } catch (error) {
    console.error("❌ AI Error:", error.response?.data || error.message);
    return msg.reply("❌ Terjadi kesalahan saat memproses AI.");
  }
}

module.exports = aiHandler;
