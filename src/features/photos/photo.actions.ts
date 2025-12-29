import { deleteWebPhoto } from "./photo.storage";
import { deletePhoto as deletePhotoDoc } from "./photo.service";
import type { Photo } from "./photo.types";

export async function deletePhoto(photo: Pick<Photo, "id" | "storagePath">) {
  if (!photo.storagePath) {
    throw new Error("Photo has no storagePath");
  }

  // 1. delete file
  await deleteWebPhoto(photo.storagePath);

  // 2. delete firestore doc
  await deletePhotoDoc(photo.id);
}
