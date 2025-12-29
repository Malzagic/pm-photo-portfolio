import { useEffect, useState } from "react";
import { getPhotoById } from "./photo.queries";
import type { Photo } from "./photo.types";

export function useAdminPhoto(photoId: string) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPhotoById(photoId);
      setPhoto(data);
      setLoading(false);
    }

    load();
  }, [photoId]);

  return { photo, loading };
}
