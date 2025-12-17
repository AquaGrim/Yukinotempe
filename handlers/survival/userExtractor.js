/**
 * Extract nomor user yang benar dari msg object
 * Menangani pesan pribadi, grup, dan device ID
 * @param {Object} msg - WhatsApp message object
 * @returns {string} Nomor user (misal: 62812345678) atau device ID (misal: 140067641258044@lid)
 */
function extractUserNumber(msg) {
  const fromId = msg.from;

  // DEBUG: Log semua informasi message
  console.log("[EXTRACT_USER] Debug info:");
  console.log("  msg.from:", msg.from);
  console.log("  msg.author:", msg.author);
  console.log("  msg.fromMe:", msg.fromMe);
  console.log("  msg.isGroup:", msg.isGroup);
  console.log("  msg._data?.notifyName:", msg._data?.notifyName);
  if (msg._data) {
    const keys = Object.keys(msg._data).slice(0, 30);
    console.log("  msg._data keys:", keys);
    // Log beberapa property penting
    if (msg._data.id) console.log("  msg._data.id:", msg._data.id);
    if (msg._data.from) console.log("  msg._data.from:", msg._data.from);
    if (msg._data.to) console.log("  msg._data.to:", msg._data.to);
  }

  // Jika pesan dari grup (berakhir dengan @g.us)
  if (fromId.endsWith("@g.us")) {
    console.log("[EXTRACT_USER] Pesan dari GRUP");

    // Cek msg._data.to terlebih dahulu (untuk private msg yang dikirim dari bot)
    if (msg._data?.to && msg._data.to.includes("@c.us")) {
      const toMatch = msg._data.to.match(/^(\d+)@/);
      if (toMatch) {
        const toNumber = toMatch[1];
        // Validasi: nomor telpon panjang (10+ digit) dan bukan group ID
        if (/^\d{10,}$/.test(toNumber) && !toNumber.startsWith("120")) {
          console.log("[EXTRACT_USER] ✓ Nomor valid dari _data.to:", toNumber);
          return toNumber;
        }
      }
    }

    // Fallback: Cek msg.author sebagai device ID
    if (msg.author) {
      console.log(
        "[EXTRACT_USER] Using device ID from msg.author:",
        msg.author
      );
      // Return device ID as-is (format: 140067641258044@lid)
      return msg.author;
    }

    console.log(
      "[EXTRACT_USER] ✗ Tidak bisa extract nomor atau device ID dari grup"
    );
    return null;
  }

  // Pesan pribadi (format: 62812345678@c.us)
  console.log("[EXTRACT_USER] Pesan PRIBADI");
  const userNumber = fromId.split("@")[0];
  console.log("[EXTRACT_USER] ✓ Nomor dari pesan pribadi:", userNumber);
  return userNumber;
}

module.exports = { extractUserNumber };
