import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PHOTOS_COLLECTION } from "./photo.config";
const photosCollection = collection(db, PHOTOS_COLLECTION);
export async function createPhoto(data) {
    const docRef = await addDoc(photosCollection, {
        ...data,
        createdAt: serverTimestamp(),
        takenAt: serverTimestamp(),
    });
    return docRef.id;
}
export async function updatePhoto(id, data) {
    const ref = doc(db, PHOTOS_COLLECTION, id);
    await updateDoc(ref, data);
}
export async function deletePhoto(id) {
    const ref = doc(db, PHOTOS_COLLECTION, id);
    await deleteDoc(ref);
}
export async function getPhotoById(id) {
    const ref = doc(db, PHOTOS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
}
export async function getPhotosByCategory(category) {
    const q = query(photosCollection, where("category", "==", category), where("published", "==", true), orderBy("takenAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}
