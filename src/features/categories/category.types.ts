/**
 * Interface representing a photo category in the system.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export type CategoryCreateInput = Omit<Category, "id" | "slug">;
