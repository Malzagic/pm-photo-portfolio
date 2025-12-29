import { useEffect, useState } from "react";
import type { Photo } from "./photo.types";
import { getAllPhotos } from "./photo.queries";

export function useAdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllPhotos();
        setPhotos(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load photos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { photos, loading, error };
}
