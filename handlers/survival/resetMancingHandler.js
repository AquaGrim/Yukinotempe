const { loadUsers, saveUsers } = require('./utils');

async function resetMancingHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;

  // Ganti nomor admin sesuai milikmu
  const adminNumber = '6281292744550'; // tanpa + dan @c.us

  if (sender !== adminNumber) {
    return msg.reply('   ^}^r Perintah ini hanya untuk admin.');
  }

  const users = loadUsers();
  let count = 0;

  for (const user of Object.values(users)) {
    if (user.fishing && user.fishing.active) {
      user.fishing.active = false;
      count++;
    }
  }

  saveUsers(users);
  return msg.reply(`   ^=^r Status mancing direset untuk ${count} user.`);
}

module.exports = resetMancingHandler;
