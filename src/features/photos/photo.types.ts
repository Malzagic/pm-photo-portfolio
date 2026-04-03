import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * PhotoCategory is now dynamic.
 * We use 'string' to allow any category slug created in the Admin Panel.
 */
export type PhotoCategory = string;

export interface Photo {
  id: string;
  title: string;
  slug: string;
  category: PhotoCategory; // This will now accept any string slug
  location?: string;
  featured: boolean;
  published: boolean;
  aspectRatio: number;
  storagePath: string;

  // READ type (from Firestore)
  createdAt: Timestamp;
  takenAt: Timestamp;
}

/**
 * WRITE type (to Firestore)
 * Used when creating new photo entries.
 */
export type PhotoCreateInput = Omit<Photo, "id" | "createdAt" | "takenAt"> & {
  createdAt?: FieldValue;
  takenAt?: FieldValue;
};
