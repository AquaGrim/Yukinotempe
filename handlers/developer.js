const axios = require("axios");

async function developerHandler(client, msg) {
  const text = msg.body.trim().toLowerCase();
  if (text.startsWith("!run")) {
    await msg.reply(
      "⚠️ Eksekusi kode dinonaktifkan demi keamanan.\n(Simulasi output: Hello World)"
    );
    return true;
  }
  if (text.startsWith("!github")) {
    const repo = text.slice(7).trim();
    if (!repo) {
      await msg.reply("❗ Sertakan nama repo. Contoh: !github facebook/react");
      return true;
    }
    try {
      const res = await axios.get(`https://api.github.com/repos/${repo}`);
      const d = res.data;
      await msg.reply(
        `📦 ${d.full_name}\n⭐ Stars: ${d.stargazers_count}\n🍴 Forks: ${
          d.forks_count
        }\n📜 ${d.description || "Tidak ada"}\n🔗 ${d.html_url}`
      );
    } catch (e) {
      await msg.reply("⚠️ Repositori tidak ditemukan.");
    }
    return true;
  }
  return false;
}

module.exports = developerHandler;
