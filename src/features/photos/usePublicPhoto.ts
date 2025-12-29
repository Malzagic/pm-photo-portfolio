import { useEffect, useState } from "react";
import { getPhotoBySlug } from "./photo.queries";
import type { Photo } from "./photo.types";

export function usePublicPhoto(slug: string) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPhotoBySlug(slug);
      setPhoto(data);
      setLoading(false);
    }

    load();
  }, [slug]);

  return { photo, loading };
}
