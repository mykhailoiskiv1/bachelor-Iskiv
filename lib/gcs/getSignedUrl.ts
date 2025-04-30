import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function getSignedUrl(filePath: string): Promise<string> {
  const [url] = await bucket.file(filePath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000,
  });

  return url;
}