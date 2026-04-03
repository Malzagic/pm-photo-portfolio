import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
/**
 * In-memory cache for already resolved URLs.
 * Prevents unnecessary calls to Firebase Storage.
 */
const urlCache = new Map<string, string>();
/**
 * Uploads a photo to Firebase Storage.
 * Returns storagePath and public download URL.
 */
export async function uploadWebPhoto(file: File): Promise<{ storagePath: string; url: string }> {
  // Generate unique filename (timestamp + original name)
  const fileName = `${Date.now()}-${file.name}`;
  const storagePath = `photos/web/${fileName}`;
  const storageRef = ref(storage, storagePath);
  // Upload file to Firebase Storage
  await uploadBytes(storageRef, file);
  // Get public download URL
  const url = await getDownloadURL(storageRef);
  // Cache URL for future use
  urlCache.set(storagePath, url);
  return {
    storagePath,
    url,
  };
}
/**
 * Returns public URL for a given storage path.
 * Uses cache to avoid redundant Firebase calls.
 */
export async function getPhotoUrl(storagePath: string): Promise<string> {
  // Return cached URL if available
  const cached = urlCache.get(storagePath);
  if (cached) return cached;
  const storageRef = ref(storage, storagePath);
  const url = await getDownloadURL(storageRef);
  // Cache result
  urlCache.set(storagePath, url);
  return url;
}
/**
 * Deletes a photo from Firebase Storage.
 */
export async function deleteWebPhoto(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
  // Remove from cache
  urlCache.delete(storagePath);
}
