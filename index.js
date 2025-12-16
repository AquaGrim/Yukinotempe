const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const moment = require("moment");

// Handlers
const tebakKataHandler = require("./handlers/tebakKataHandler");
const llamaHandler = require("./handlers/llamaHandler");
const qwen = require("./qwen");
const {
  isDisabled,
  handleFeatureToggle,
} = require("./handlers/featureToggleHandler");
const { isBanned, handleBanCommands } = require("./handlers/banHandler");
const afkHandler = require("./handlers/afk");
const interaktifHandler = require("./handlers/interaktif");
const stickerHandler = require("./handlers/sticker");
const edukasiHandler = require("./handlers/edukasi");
const downloaderHandler = require("./handlers/downloader");
const utilitasHandler = require("./handlers/utilitas");
const developerHandler = require("./handlers/developer");
const aiHandler = require("./handlers/ai");

const {
  loadUsers,
  saveUsers,
  addExp,
  formatUserProfile,
  addItem,
} = require("./handlers/survival/utils");
const resetMancingHandler = require("./handlers/survival/resetMancingHandler");
const sellHandler = require("./handlers/survival/sellHandler");
const fishingHandler = require("./handlers/survival/fishingHandler");
const leaderboardHandler = require("./handlers/survival/leaderboardHandler");
const giftHandler = require("./handlers/survival/giftHandler");
const registerHandler = require("./handlers/survival/registerHandler");
const profileHandler = require("./handlers/survival/profilHandler");
const adventureHandler = require("./handlers/survival/adventureHandler");
const battleHandler = require("./handlers/survival/battleHandler");
const { shopHandler, buyHandler } = require("./handlers/survival/shopHandler");
const useItemHandler = require("./handlers/survival/itemHandler");
const gachaHandler = require("./handlers/survival/gachaHandler");
const missionHandler = require("./handlers/survival/mission");
const dailyHandler = require("./handlers/survival/dailyHandler");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

console.log("🚀 Menginisialisasi bot WhatsApp...");

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("📱 Scan QR Code untuk login...");
});

client.on("ready", () => {
  console.log("✅ Bot sudah siap!");
  console.log("📱 Koneksi WhatsApp berhasil!");
});

client.on("authenticated", () => {
  console.log("🔐 Bot berhasil authenticated!");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Auth failure:", msg);
});

client.on("disconnected", (reason) => {
  console.log("⚠️ Bot disconnected:", reason);
});

// Error handling global
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

client.on("message", async (msg) => {
  try {
    // Dapatkan sender ID langsung dari msg.from atau msg.author
    const senderId = msg.from || msg.author;

    // Extract nomor telepon dari sender ID (format: 62812345678@c.us)
    const senderNumber = senderId.split("@")[0];

    const text = msg.body ? msg.body.trim().toLowerCase() : "";
    const body = msg.body ? msg.body.toLowerCase() : "";

    // Skip jika tidak ada pesan
    if (!text && !body) return;

    let chat;
    try {
      chat = await msg.getChat();
    } catch (err) {
      console.warn(
        `⚠️ Gagal mengambil chat dari ${senderNumber}: ${err.message}`
      );
      return;
    }

    // Stop jika chat tidak bisa diambil
    if (!chat) return;

    const isGroup = chat.isGroup;
    const groupId = chat.id?._serialized || senderId;

    // Cek admin hanya jika dalam group
    let isAdmin = false;
    if (isGroup && chat.participants) {
      const participant = chat.participants.find(
        (p) =>
          p.id?.user === senderNumber ||
          p.id?._serialized?.includes(senderNumber)
      );
      isAdmin = participant?.isAdmin || false;
    }

    // Log debug
    console.log(`📩 Pesan dari ${senderNumber}: ${text}`);

    // 🔒 Cek apakah nomor dibanned
    if (isBanned(senderNumber)) return;

    // 🌐 Toggle fitur
    if (text.startsWith("!disable") || text.startsWith("!enable")) {
      return handleFeatureToggle(msg, senderNumber, text);
    }

    // 🔧 Tangani command ban/unban
    if (text.startsWith("!ban") || text.startsWith("!unban")) {
      return handleBanCommands(msg, senderNumber, text);
    }

    // ⏳ Tangani AFK
    if (await afkHandler(client, msg)) return;

    if (await tebakKataHandler(client, msg)) return;

    // 🎮 Fitur interaktif
    if (await interaktifHandler(client, msg)) return;

    // 🖼️ Fitur stiker
    if (await stickerHandler(client, msg)) return;

    // 📚 Fitur edukasi
    if (await edukasiHandler(client, msg)) return;

    if (await qwen(msg)) return;

    if (await llamaHandler(msg)) return;

    // 📥 Fitur downloader
    if (await downloaderHandler(client, msg)) return;

    // ⚙️ Fitur utilitas
    if (await utilitasHandler(client, msg)) return;

    // 💻 Fitur developer
    if (await developerHandler(client, msg)) return;

    // 🤖 Fitur AI Chat
    if (await aiHandler(client, msg)) return;

    if (text.startsWith("!regist")) {
      return registerHandler(msg);
    }
    if (text === "!profil") {
      return profileHandler(msg);
    }
    if (text === "!petualang") {
      return adventureHandler(msg);
    }
    if (text === "!lawan") {
      return battleHandler(msg);
    }
    if (text === "!toko") {
      return shopHandler(msg);
    }
    if (text.startsWith("!beli")) {
      return buyHandler(msg);
    }
    if (text.startsWith("!pakai")) {
      return useItemHandler(msg);
    }
    if (msg.body.toLowerCase().startsWith("!gacha")) {
      await gachaHandler(msg);
    }
    if (text === "!misi") {
      return missionHandler(msg);
    }
    if (text === "!daily") {
      return dailyHandler(msg);
    }
    if (text.startsWith("!gift")) {
      return giftHandler(msg);
    }
    if (text === "!leaderboard") {
      return leaderboardHandler(msg);
    }
    if (msg.body.startsWith("!jual")) {
      return sellHandler(msg);
    }
    if (msg.body.startsWith("!mancing")) {
      return fishingHandler(msg);
    }
    if (body === "!resetmancing") {
      return resetMancingHandler(msg);
    }
  } catch (err) {
    console.error("❌ Terjadi kesalahan:", err.message);
  }
});

client.initialize();
