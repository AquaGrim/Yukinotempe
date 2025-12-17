/**
 * Extract nomor user yang benar dari msg object
 * Menangani pesan pribadi dan grup dengan benar
 * @param {Object} msg - WhatsApp message object
 * @returns {string} Nomor user (misal: 62812345678)
 */
function extractUserNumber(msg) {
  const fromId = msg.from;

  // Jika pesan dari grup (berakhir dengan @g.us)
  if (fromId.endsWith("@g.us")) {
    // Format grup: "120363422443959261-1234567890@g.us"
    // Extract nomor user dari author jika ada
    if (msg.author) {
      const author = msg.author.split("@")[0];
      // Jika author tidak berisi angka saja, mungkin itu ID grup
      // Cek apakah ada nomor telpon format Indonesia
      if (/^\d{10,}$/.test(author)) {
        return author;
      }
    }
    // Jika tidak bisa dari author, user harus kirim pesan pribadi terlebih dahulu
    return null;
  }

  // Pesan pribadi (format: 62812345678@c.us)
  return fromId.split("@")[0];
}

module.exports = { extractUserNumber };
