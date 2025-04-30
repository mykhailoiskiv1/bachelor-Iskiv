import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToGCS } from '@/lib/gcs/gcs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;

  try {
    const url = await uploadImageToGCS(buffer, filename, file.type);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Error during file upload:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
