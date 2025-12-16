const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const { MessageMedia } = require("whatsapp-web.js");

async function convertWebpToJpeg(media) {
  try {
    const tempInput = path.join(__dirname, "../temp_sticker.webp");
    const tempOutput = path.join(__dirname, "../temp_converted.jpg");

    // Write WebP data to temp file
    fs.writeFileSync(tempInput, Buffer.from(media.data, "base64"));

    // Load with Jimp dan convert ke JPEG
    const image = await Jimp.read(tempInput);
    await image.write(tempOutput);

    const convertedData = fs.readFileSync(tempOutput).toString("base64");
    fs.unlinkSync(tempInput);
    fs.unlinkSync(tempOutput);

    return new MessageMedia("image/jpeg", convertedData);
  } catch (error) {
    console.error("Conversion Error:", error);
    return null;
  }
}

module.exports = { convertWebpToJpeg };
