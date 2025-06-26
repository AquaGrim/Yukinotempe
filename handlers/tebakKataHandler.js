const fs = require('fs');
const path = require('path');

const soalPath = path.join(__dirname, '../data/tebakKata.json');
const soalList = JSON.parse(fs.readFileSync(soalPath));
const activeGames = new Map(); // key: chatId, value: { question, answer, messageId, timeout }

function getRandomSoal() {
  return soalList[Math.floor(Math.random() * soalList.length)];
}

async function tebakKataHandler(client, msg) {
  const text = msg.body.trim().toLowerCase();
  const chat = await msg.getChat();
  const chatId = chat.id._serialized;

  // Start game
  if (text === '!tebakkata') {
    if (activeGames.has(chatId)) {
      return msg.reply('❗ Masih ada soal yang belum dijawab!');
    }

    const soal = getRandomSoal();
    const sentMsg = await msg.reply(`🧠 *Tebak Kata!*\n\n${soal.question}\n\n💬 *Balas pesan ini* dengan jawabanmu (30 detik).`);

    const timeout = setTimeout(() => {
      if (activeGames.has(chatId)) {
        client.sendMessage(chatId, `⏰ Waktu habis! Jawabannya adalah *${soal.answer}*`);
        activeGames.delete(chatId);
      }
    }, 30000);

    activeGames.set(chatId, {
      question: soal.question,
      answer: soal.answer.toLowerCase(),
      messageId: sentMsg.id.id, // HANYA id.id (bukan _serialized)
      timeout
    });

    return;
  }

  // Jika user reply pesan
  if (msg.hasQuotedMsg) {
    const quoted = await msg.getQuotedMessage();
    const game = activeGames.get(chatId);

    if (game && quoted.id.id === game.messageId) { // COCOKKAN DENGAN id.id
      if (text === game.answer) {
        clearTimeout(game.timeout);
        activeGames.delete(chatId);
        return msg.reply(`🎉 *Benar!* Jawabannya adalah *${game.answer}*`);
      } else {
        return msg.reply('❌ Salah! Coba lagi.');
      }
    }
  }
}
module.exports = tebakKataHandler;
