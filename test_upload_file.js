const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djgeobjv5',
  api_key: '113278724411213',
  api_secret: 'xRDTS3OQ_hzb7EGgCz4B0IC_XWA',
});

async function testUpload() {
  try {
    const buffer = fs.readFileSync('public/logo.jpg');
    const mimeType = 'image/jpeg';
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    console.log("Uploading...");
    cloudinary.uploader.upload(base64Data, {
      resource_type: 'image',
      folder: 'atharva_real_infra',
    }, (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
      } else {
        console.log('Success:', result.secure_url);
      }
    });
  } catch (err) {
    console.error("Test error:", err);
  }
}

testUpload();
