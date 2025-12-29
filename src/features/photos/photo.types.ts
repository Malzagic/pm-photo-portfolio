import type { Timestamp, FieldValue } from "firebase/firestore";

export type PhotoCategory = "astro" | "landscape" | "nature";

export interface Photo {
  id: string;
  title: string;
  slug: string;
  category: PhotoCategory;
  location?: string;
  featured: boolean;
  published: boolean;
  aspectRatio: number;
  storagePath: string;

  // READ type (z Firestore)
  createdAt: Timestamp;
  takenAt: Timestamp;
}

// WRITE type (do Firestore)
export type PhotoCreateInput = Omit<Photo, "id" | "createdAt" | "takenAt"> & {
  createdAt?: FieldValue;
  takenAt?: FieldValue;
};
