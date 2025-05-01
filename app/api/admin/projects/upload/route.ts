import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToGCS } from '@/lib/gcs/gcs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name}`;

    const url = await uploadImageToGCS(buffer, filename, file.type, 'projects');

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('[UPLOAD_PROJECT_IMAGE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
