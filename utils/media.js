const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertWebpToJpeg(media) {
  try {
    const tempInput = path.join(__dirname, '../temp_sticker.webp');
    const tempOutput = path.join(__dirname, '../temp_converted.jpg');
    
    fs.writeFileSync(tempInput, media.data, 'base64');
    await sharp(tempInput).toFormat('jpeg').toFile(tempOutput);
    
    const convertedData = fs.readFileSync(tempOutput).toString('base64');
    fs.unlinkSync(tempInput);
    fs.unlinkSync(tempOutput);
    
    return new MessageMedia('image/jpeg', convertedData);
  } catch (error) {
    console.error('Conversion Error:', error);
    return null;
  }
}

module.exports = { convertWebpToJpeg };
