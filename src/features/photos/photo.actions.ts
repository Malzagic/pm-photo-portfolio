/**
 * src/features/photos/photo.actions.ts
 * Coordinates photo deletion across server storage and Firestore.
 */
import { deleteWebPhoto } from "./photo.storage";
import { deletePhoto as deletePhotoDoc } from "./photo.service";
import type { Photo } from "./photo.types";

export async function deletePhoto(photo: Pick<Photo, "id" | "storagePath">): Promise<void> {
  // 1. Delete physical file from Firebase Storage
  if (photo.storagePath) {
    try {
      await deleteWebPhoto(photo.storagePath);
    } catch (error) {
      // Log error but continue to ensure Firestore document is deleted
      console.warn("Storage file could not be deleted, proceeding with Firestore cleanup", error);
    }
  }

  // 2. ALWAYS delete the Firestore document to prevent "ghost photos" in UI
  await deletePhotoDoc(photo.id);
}
