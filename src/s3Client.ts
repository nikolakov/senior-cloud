import { S3, ListBucketsCommand } from '@aws-sdk/client-s3';

if (
  !process.env.S3_KEY ||
  !process.env.S3_SECRET ||
  !process.env.S3_ENDPOINT ||
  !process.env.S3_REGION
) {
  throw new Error('missing configuration variables');
}

export const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

export const initializeSpacesConnection = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log('[s3Client.ts]', 'Connected to S3 Buckets');
  } catch (e) {
    console.log('Could not fetch buckets', e);
  }
};
