import { collection, getDocs, getDoc, doc, orderBy, where, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PHOTOS_COLLECTION } from "./photo.config";
import type { Photo } from "./photo.types";

export async function getAllPhotos(): Promise<Photo[]> {
  const q = query(collection(db, PHOTOS_COLLECTION), orderBy("createdAt", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Photo, "id">),
  }));
}

export async function getPhotoById(photoId: string): Promise<Photo | null> {
  const ref = doc(db, PHOTOS_COLLECTION, photoId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...(snap.data() as Omit<Photo, "id">),
  };
}

export async function getPhotoBySlug(slug: string): Promise<Photo | null> {
  const q = query(
    collection(db, PHOTOS_COLLECTION),
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  const doc = snap.docs[0];

  return {
    id: doc.id,
    ...(doc.data() as Omit<Photo, "id">),
  };
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const q = query(
    collection(db, PHOTOS_COLLECTION),
    where("featured", "==", true),
    where("published", "==", true),
    orderBy("takenAt", "desc"),
    limit(6)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Photo, "id">),
  }));
}
