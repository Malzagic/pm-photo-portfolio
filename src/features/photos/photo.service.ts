import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PHOTOS_COLLECTION } from "./photo.config";
import type { Photo, PhotoCategory, PhotoCreateInput } from "./photo.types";

const photosCollection = collection(db, PHOTOS_COLLECTION);

export async function createPhoto(data: PhotoCreateInput): Promise<string> {
  const docRef = await addDoc(photosCollection, {
    ...data,
    createdAt: serverTimestamp(),
    takenAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updatePhoto(id: string, data: Partial<Omit<Photo, "id" | "createdAt">>): Promise<void> {
  const ref = doc(db, PHOTOS_COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deletePhoto(id: string): Promise<void> {
  const ref = doc(db, PHOTOS_COLLECTION, id);
  await deleteDoc(ref);
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const ref = doc(db, PHOTOS_COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return { id: snap.id, ...(snap.data() as Omit<Photo, "id">) };
}

export async function getPhotosByCategory(category: PhotoCategory): Promise<Photo[]> {
  const q = query(
    photosCollection,
    where("category", "==", category),
    where("published", "==", true),
    orderBy("takenAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Photo, "id">),
  }));
}
