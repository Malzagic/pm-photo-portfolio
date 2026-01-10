import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

const urlCache = new Map<string, string>();

export async function uploadWebPhoto(file: File, photoId: string): Promise<{ storagePath: string; url: string }> {
  const storagePath = `photos/web/${photoId}.jpg`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return { storagePath, url };
}

export async function getPhotoUrl(storagePath: string): Promise<string> {
  const cached = urlCache.get(storagePath);
  if (cached) {
    return cached;
  }

  const fileRef = ref(storage, storagePath);
  const url = await getDownloadURL(fileRef);

  urlCache.set(storagePath, url);
  return url;
}

export async function deleteWebPhoto(storagePath: string): Promise<void> {
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}
