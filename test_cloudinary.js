const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djgeobjv5',
  api_key: '113278724411213',
  api_secret: 'xRDTS3OQ_hzb7EGgCz4B0IC_XWA',
});

// A 1x1 transparent PNG base64
const base64Data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

cloudinary.uploader.upload(base64Data, {
  folder: 'atharva_real_infra',
}, (error, result) => {
  if (error) {
    console.error('Upload Failed:', error);
  } else {
    console.log('Upload Success:', result.secure_url);
  }
});
