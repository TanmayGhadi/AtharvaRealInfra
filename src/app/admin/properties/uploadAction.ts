'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'djgeobjv5',
  api_key: '113278724411213',
  api_secret: 'xRDTS3OQ_hzb7EGgCz4B0IC_XWA',
});

export async function uploadMediaServer(formData: FormData) {
  const file = formData.get('file') as File;
  const resourceType = formData.get('type') as 'image' | 'video' || 'image';

  if (!file) {
    throw new Error('No file provided');
  }

  // Convert File to base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64Data, {
      resource_type: resourceType,
      folder: 'atharva_real_infra',
    }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        resolve({ url: result?.secure_url });
      }
    });
  });
}
