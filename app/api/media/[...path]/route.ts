import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/gcs';

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/api\/media\//, '');

    if (!path) {
      return NextResponse.json({ url: '' });
    }

    const file = bucket.file(decodeURIComponent(path));

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 рік
    });

    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}
