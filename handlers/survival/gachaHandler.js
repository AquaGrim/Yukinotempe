const { loadUsers, saveUsers, addItem } = require('./utils');

async function gachaHandler(msg) {
  const contact = await msg.getContact();
  const sender = contact.number;
  const users = loadUsers();
  const user = users[sender];

  if (!user || !user.registered) {
    return msg.reply('   ^}^w Kamu belum terdaftar. Gunakan perintah: !regist Nama | Umur');
  }

  const args = msg.body.trim().split(' ');
  const jumlahGacha = parseInt(args[1]) || 1;

  const costPerRoll = 50;
  const totalCost = jumlahGacha * costPerRoll;

  if (user.money < totalCost) {
    return msg.reply(`   ^=^r Uang ${user.name} tidak cukup untuk melakukan ${jumlahGacha} gacha. Total: ${totalCost} gold`);
  }

  user.money -= totalCost;

  let dapat = {
    Potion: 0,
    'Gold Coin': 0,
    'Buff Scroll': 0,
    Kazuha: 0,
    Furina: 0,
    'Raiden Shogun': 0,
    'Kamisato Ayato': 0,
    Tartaglia: 0,
    'Vestia Zeta': 0,
    Sakura: 0,
    'mythia batford': 0,
    'Gwar Gura': 0,
    'Monkey D. Luffy': 0,
    'Nephie Phelia': 0,
    'Mie Ayam': 0,
    Nothing: 0
  };

  for (let i = 0; i < jumlahGacha; i++) {
    const chance = Math.random();
    let reward = 'Nothing';

    if (chance < 0.2) reward = 'Potion';
    else if (chance < 0.35) reward = 'Gold Coin';
    else if (chance < 0.55) reward = 'Buff Scroll';
    else if (chance < 0.551) reward = 'Kazuha';
    else if (chance < 0.5511) reward = 'Furina';
    else if (chance < 0.5512) reward = 'Raiden Shogun';
    else if (chance < 0.5513) reward = 'Kamisato Ayato';
    else if (chance < 0.5514) reward = 'Tartaglia';
    else if (chance < 0.5515) reward = 'Vestia Zeta';
    else if (chance < 0.5516) reward = 'Sakura';
    else if (chance < 0.5517) reward = 'mythia batford';
    else if (chance < 0.5518) reward = 'Gwar Gura';
    else if (chance < 0.5519) reward = 'Monkey D. Luffy';
    else if (chance < 0.552) reward = 'Nephie Phelia';
    else if (chance < 0.56) reward = 'Mie Ayam';

    dapat[reward]++;

    if (reward !== 'Nothing') {
      addItem(user, reward, 1); // gunakan fungsi efisien
    }
  }

  saveUsers(users);

let replyMsg = `🎰 *${user.name} melakukan ${jumlahGacha} kali gacha:*\n`;

if (dapat.Potion)       replyMsg += `🧪 Potion         : ${dapat.Potion}\n`;
if (dapat['Gold Coin']) replyMsg += `💰 Gold Coin      : ${dapat['Gold Coin']}\n`;
if (dapat['Buff Scroll']) replyMsg += `📜 Buff Scroll    : ${dapat['Buff Scroll']}\n`;
if (dapat['Kazuha'])    replyMsg += `🎁 Kazuha (Rare!) : ${dapat['Kazuha']}\n`;
if (dapat['Furina'])    replyMsg +=    `^=^n^a Furina (Epic!) : ${dapat['Furina']}\n`;
if (dapat['Raiden Shogun']) replyMsg += `^=^n^a Raiden Shogun (Epic!) : ${dapat['Raiden Shogun']}\n`;
if (dapat['Kamisato Ayato']) replyMsg += `^=^n^a Kamisato Ayato (Epic!) : ${dapat['Kamisato Ayato']}\n`;
if (dapat['Tartaglia']) replyMsg +=    `^=^n^a Tartaglia (Epic!) : ${dapat['Tartaglia']}\n`;
if (dapat['Vestia Zeta']) replyMsg +=  `^=^n^a Vestia Zeta (Epic!) : ${dapat['Vestia Zeta']}\n`;
if (dapat['Sakura'])    replyMsg +=    `^=^n^a Sakura (Epic!) : ${dapat['Sakura']}\n`;
if (dapat['mythia batford']) replyMsg += `^=^n^a Mythia Batford (Epic!) : ${dapat['mythia batford']}\n`;
if (dapat['Gwar Gura']) replyMsg +=    `^=^n^a Gwar Gura (Epic!) : ${dapat['Gwar Gura']}\n`;
if (dapat['Monkey D. Luffy']) replyMsg += `^=^n^a Monkey D. Luffy (Epic!) : ${dapat['Monkey D. Luffy']}\n`;
if (dapat['Nephie Phelia']) replyMsg += `^=^n^a Nephie Phelia (Epic!) : ${dapat['Nephie Phelia']}\n`;
if (dapat['Mie Ayam'])  replyMsg +=    `^=^s^| Mie Ayam       : ${dapat['Mie Ayam']}\n`;
if (dapat.Nothing)      replyMsg += `❌ Tidak Dapat    : ${dapat.Nothing}`;

  await msg.reply(replyMsg.trim());
}

module.exports = gachaHandler;
