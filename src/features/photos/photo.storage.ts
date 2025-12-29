import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadWebPhoto(file: File, photoId: string): Promise<{ storagePath: string; url: string }> {
  const storagePath = `photos/web/${photoId}.jpg`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return { storagePath, url };
}

export async function getPhotoUrl(storagePath: string): Promise<string> {
  const fileRef = ref(storage, storagePath);
  return getDownloadURL(fileRef);
}

export async function deleteWebPhoto(storagePath: string): Promise<void> {
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}
