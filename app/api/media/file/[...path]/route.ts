import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/api\/media\/file\//, '');

    if (!path) {
      return NextResponse.json({ url: '' }, { status: 400 });
    }

    const decodedPath = decodeURIComponent(path);
    const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${decodedPath}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('Error generating public URL:', err);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}