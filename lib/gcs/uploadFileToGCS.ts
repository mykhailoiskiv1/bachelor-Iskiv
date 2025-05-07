import { storage } from './gcs';

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function uploadFileToGCS(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    folder = 'uploads'
): Promise<string> {
    const fileUpload = bucket.file(`${folder}/${filename}`);

    const stream = fileUpload.createWriteStream({
        metadata: { contentType: mimetype },
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
            resolve(`https://storage.googleapis.com/${bucket.name}/${folder}/${filename}`);
        });
        stream.end(buffer);
    });
}
