import { Storage } from '@google-cloud/storage';

export const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function uploadImageToGCS(file: Buffer, filename: string, mimetype: string): Promise<string> {
  const fileUpload = bucket.file(`blog/${filename}`);

  const stream = fileUpload.createWriteStream({
    metadata: { contentType: mimetype },
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err: Error) => reject(err));

    stream.on('finish', () => {
      resolve(`blog/${filename}`);
    });

    stream.end(file);
  });
}
