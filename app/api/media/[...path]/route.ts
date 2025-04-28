import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/gcs';

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  const { params } = context;

  if (!params?.path) {
    return NextResponse.json({ url: '' });  
  }

  const filePath = params.path.join('/');
  const file = bucket.file(filePath);

  try {
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}

