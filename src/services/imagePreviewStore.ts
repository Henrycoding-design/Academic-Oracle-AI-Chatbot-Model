import { openDB } from 'idb';

const DB_NAME = 'academic-oracle-previews';
const STORE_NAME = 'images';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

const compressImageToWebp = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Unable to compress image preview')),
      'image/webp',
      0.78
    );
  });
};

export const saveImagePreview = async (key: string, file: File) => {
  const blob = await compressImageToWebp(file);
  const db = await dbPromise;
  await db.put(STORE_NAME, blob, key);
};

export const getImagePreview = async (key: string): Promise<Blob | undefined> => {
  const db = await dbPromise;
  return db.get(STORE_NAME, key);
};

export const clearImagePreviews = async () => {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
};
