import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'djgeobjv5',
  api_key: '113278724411213',
  api_secret: 'xRDTS3OQ_hzb7EGgCz4B0IC_XWA',
});

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'atharva_real_infra',
      },
      'xRDTS3OQ_hzb7EGgCz4B0IC_XWA'
    );

    return NextResponse.json({
      signature,
      timestamp,
      api_key: '113278724411213',
      cloud_name: 'djgeobjv5'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
