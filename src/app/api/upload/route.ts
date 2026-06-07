import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'djgeobjv5',
  api_key: '113278724411213',
  api_secret: 'xRDTS3OQ_hzb7EGgCz4B0IC_XWA',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const resourceType = formData.get('type') as 'image' | 'video' | 'raw' || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'application/octet-stream';
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(base64Data, {
        resource_type: resourceType,
        folder: 'atharva_real_infra',
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(error.message || 'Cloudinary upload failed'));
        } else {
          resolve(result);
        }
      });
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err: any) {
    console.error('API Upload Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
