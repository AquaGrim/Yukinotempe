const { loadUsers } = require("./utils");

async function missionHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];
  if (!user || !user.registered) {
    return msg.reply("❗ Kamu belum terdaftar.");
  }
  const misi = user.misi || { petualang: 0, lawan: 0 };
  const text = `🎯 *Progress Misi Harian*\n🗺️ Petualangan: ${misi.petualang}/5\n⚔️ Menang battle: ${misi.lawan}/3`;
  await msg.reply(text);
}

module.exports = missionHandler;
