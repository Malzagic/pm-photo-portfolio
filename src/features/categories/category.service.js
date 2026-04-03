import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
const CATEGORIES_COLLECTION = "categories";
/**
 * Fetches all categories from Firestore ordered by priority.
 */
export async function getCategories() {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}
/**
 * Creates a new category with an automatic slug.
 */
export async function createCategory(data) {
    const slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...data,
        slug,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}
/**
 * Removes a category by ID.
 */
export async function deleteCategory(id) {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}
