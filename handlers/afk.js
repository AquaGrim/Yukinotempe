// /handlers/afk.js
const { isDisabled } = require("./featureToggleHandler");
const afkData = new Map(); // Format: { "userID@grupID": { time, reason, messages } }

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours > 0 ? `${hours} jam` : "",
    minutes > 0 ? `${minutes} menit` : "",
    `${seconds} detik`,
  ]
    .filter(Boolean)
    .join(" ");
}

async function afkHandler(client, msg) {
  try {
    const chat = await msg.getChat().catch(() => null);
    if (!chat || !chat.id || !chat.id._serialized) return false;
    const text = msg.body.trim();
    const isGroup = chat.isGroup;
    const senderId = isGroup ? msg.author || msg.from : msg.from;
    const senderKey = isGroup ? `${senderId}@${chat.id._serialized}` : senderId;
    const groupId = chat.id._serialized;
    // [1] AKTIFKAN AFK
    if (text.toLowerCase().startsWith("!afk")) {
      if (isDisabled(groupId, "afk")) return;
      const reason = text.slice(4).trim() || "Sedang tidak aktif";
      afkData.set(senderKey, { time: Date.now(), reason, messages: [] });
      await msg.reply(`   ^=^r    *Mode AFK Aktif*\nAlasan: ${reason}`);
      return true;
    }
    // [2] HANDLE MENTION & REPLY KE USER AFK
    let mentionedUsers = msg.mentionedIds ? [...msg.mentionedIds] : [];
    if (msg.hasQuotedMsg) {
      try {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg) mentionedUsers.push(quotedMsg.author || quotedMsg.from);
      } catch {}
    }
    for (const targetId of mentionedUsers) {
      const targetKey = isGroup
        ? `${targetId}@${chat.id._serialized}`
        : targetId;
      if (afkData.has(targetKey)) {
        const afkUser = afkData.get(targetKey);
        const duration = formatDuration(Date.now() - afkUser.time);
        let contact;
        try {
          contact = await client.getContactById(targetId);
        } catch {
          contact = { number: targetId.split("@")[0] };
        }
        afkUser.messages.push({
          from: senderId.split("@")[0],
          message: msg.body,
          time: new Date().toLocaleTimeString(),
          isMention: msg.mentionedIds.includes(targetId),
          isReply: msg.hasQuotedMsg && mentionedUsers.includes(targetId),
        });
        await msg.reply(
          `   ^o    @${contact.number} sedang AFK (${duration})\n   ^=^s^} Alasan: *${afkUser.reason}*`,
          null,
          { mentions: [contact] }
        );
      }
    }
    // [3] HANDLE KEMBALI DARI AFK
    if (afkData.has(senderKey) && !text.toLowerCase().startsWith("!afk")) {
      const afkUser = afkData.get(senderKey);
      const duration = formatDuration(Date.now() - afkUser.time);
      const mentions = afkUser.messages.filter((m) => m.isMention);
      const replies = afkUser.messages.filter((m) => m.isReply);
      let replyMessage = `   ^|^e *Kembali dari AFK*\nDurasi: ${duration}\n`;
      if (mentions.length > 0) {
        replyMessage += "\n   ^=^t^t *Anda ditandai:*\n";
        for (let i = 0; i < mentions.length; i++) {
          const m = mentions[i];
          replyMessage += `${i + 1}. [${m.time}] ${m.from}: "${m.message}"\n`;
        }
      }
      if (replies.length > 0) {
        replyMessage += "\n   ^=^r    *Pesan yang membalas Anda:*\n";
        for (let i = 0; i < replies.length; i++) {
          const m = replies[i];
          replyMessage += `${i + 1}. [${m.time}] ${m.from}: "${m.message}"\n`;
        }
      }
      await msg.reply(replyMessage);
      afkData.delete(senderKey);
      return true;
    }
    return false;
  } catch (err) {
    console.error("   ^}^l Error handler AFK:", err);
    return false;
  }
}

module.exports = afkHandler;
