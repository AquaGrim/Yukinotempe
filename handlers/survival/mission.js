const { loadUsers } = require('./utils');

async function missionHandler(msg) {
const contact = await msg.getContact();
const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered) return msg.reply('❗ Kamu belum terdaftar.');

  const text = `🎯 *Progress Misi Harian*
🗺️ Petualangan: ${user.misi.petualang}/5
⚔️ Menang battle: ${user.misi.lawan}/3`;

  await msg.reply(text);
}

module.exports = missionHandler;
