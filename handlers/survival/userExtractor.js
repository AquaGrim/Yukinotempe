/**
 * Extract nomor user yang benar dari msg object
 * Menangani pesan pribadi dan grup dengan benar
 * @param {Object} msg - WhatsApp message object
 * @returns {string} Nomor user (misal: 62812345678)
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

    // Cek msg.author
    if (msg.author) {
      console.log("[EXTRACT_USER] msg.author tersedia:", msg.author);
      const authorNumber = msg.author.split("@")[0];

      // Validasi: nomor telpon Indonesia biasanya 62... atau lebih dari 10 digit
      if (/^\d{10,}$/.test(authorNumber)) {
        console.log("[EXTRACT_USER] ✓ Nomor valid dari author:", authorNumber);
        return authorNumber;
      } else {
        console.log(
          "[EXTRACT_USER] ✗ Author bukan nomor telpon:",
          authorNumber
        );
      }
    }

    // Coba extract dari _data.id (jika ada)
    if (msg._data?.id) {
      console.log("[EXTRACT_USER] Cek msg._data.id:", msg._data.id);
      // Format: "true_120363422443959261-1234567890@g.us_AABBCC..."
      const idMatch = msg._data.id.match(/(\d+)@/);
      if (idMatch) {
        const potentialNumber = idMatch[1];
        console.log(
          "[EXTRACT_USER] Potential number from _data.id:",
          potentialNumber
        );
        if (
          /^\d{10,}$/.test(potentialNumber) &&
          !potentialNumber.startsWith("120")
        ) {
          console.log(
            "[EXTRACT_USER] ✓ Nomor valid dari _data.id:",
            potentialNumber
          );
          return potentialNumber;
        }
      }
    }

    console.log("[EXTRACT_USER] ✗ Tidak bisa extract nomor dari grup");
    return null;
  }

  // Pesan pribadi (format: 62812345678@c.us)
  console.log("[EXTRACT_USER] Pesan PRIBADI");
  const userNumber = fromId.split("@")[0];
  console.log("[EXTRACT_USER] ✓ Nomor dari pesan pribadi:", userNumber);
  return userNumber;
}

module.exports = { extractUserNumber };
