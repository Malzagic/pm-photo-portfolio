/**
 * src/features/photos/photo.actions.ts
 * Coordinates photo deletion across server storage and Firestore.
 */
import { deleteWebPhoto } from "./photo.storage";
import { deletePhoto as deletePhotoDoc } from "./photo.service";
import type { Photo } from "./photo.types";

export async function deletePhoto(photo: Pick<Photo, "id" | "storagePath">, idToken: string) {
  if (!photo.storagePath) {
    // If there's no path, just clean up the Firestore document
    await deletePhotoDoc(photo.id);
    return;
  }

  try {
    /**
     * If it's a legacy path (contains 'photos/web'), it's from Firebase.
     * We still call our server to try and delete, but we wrap it
     * to ensure Firestore deletion happens regardless.
     */
    await deleteWebPhoto(photo.storagePath, idToken);
  } catch (error) {
    console.warn("Server could not delete file, but we will proceed with Firestore cleanup", error);
  }

  // 2. ALWAYS delete the Firestore document to fix the "ghost photos" issue
  await deletePhotoDoc(photo.id);
}
