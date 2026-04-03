import { Storage } from '@google-cloud/storage';

const globalForGcs = globalThis as unknown as { gcsStorage: Storage };

export const gcsStorage =
  globalForGcs.gcsStorage ??
  new Storage(
    process.env.GCS_KEY_FILE_PATH
      ? { keyFilename: process.env.GCS_KEY_FILE_PATH }
      : // Falls back to Application Default Credentials (Workload Identity etc.)
        {}
  );

if (process.env.NODE_ENV !== 'production') globalForGcs.gcsStorage = gcsStorage;

export const BUCKET = process.env.GCS_BUCKET ?? 'fitness';

/**
 * Uploads a buffer to GCS at the given key.
 */
export async function uploadObject(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const file = gcsStorage.bucket(BUCKET).file(key);
  await file.save(buffer, { contentType, resumable: false });
}

/**
 * Returns a V4 signed URL for downloading the given object (valid for 1 hour).
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const file = gcsStorage.bucket(BUCKET).file(key);
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600 * 1000,
  });
  return url;
}
