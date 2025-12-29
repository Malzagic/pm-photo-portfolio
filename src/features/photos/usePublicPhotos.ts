import { useEffect, useState } from "react";
import { getPhotosByCategory } from "./photo.service";
import type { Photo, PhotoCategory } from "./photo.types";

export function usePublicPhotos(category: PhotoCategory) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPhotosByCategory(category);
      setPhotos(data);
      setLoading(false);
    }

    load();
  }, [category]);

  return { photos, loading };
}
