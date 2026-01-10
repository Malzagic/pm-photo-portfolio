import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
const urlCache = new Map();
export async function uploadWebPhoto(file, photoId) {
    const storagePath = `photos/web/${photoId}.jpg`;
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { storagePath, url };
}
export async function getPhotoUrl(storagePath) {
    const cached = urlCache.get(storagePath);
    if (cached) {
        return cached;
    }
    const fileRef = ref(storage, storagePath);
    const url = await getDownloadURL(fileRef);
    urlCache.set(storagePath, url);
    return url;
}
export async function deleteWebPhoto(storagePath) {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
}
