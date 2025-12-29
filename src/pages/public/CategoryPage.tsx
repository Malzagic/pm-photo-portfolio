import { useParams } from "react-router-dom";
import { usePublicPhotos } from "@/features/photos/usePublicPhotos";
import type { PhotoCategory } from "@/features/photos/photo.types";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";

const ALLOWED_CATEGORIES: PhotoCategory[] = ["astro", "landscape", "nature"];

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  const isValidCategory = !!category && ALLOWED_CATEGORIES.includes(category as PhotoCategory);

  // HOOKI ZAWSZE NA GÓRZE
  const typedCategory = isValidCategory ? (category as PhotoCategory) : "landscape";

  const { photos, loading } = usePublicPhotos(typedCategory);

  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadUrls() {
      const entries = await Promise.all(
        photos.map(async photo => {
          const url = await getPhotoUrl(photo.storagePath);
          return [photo.id, url] as const;
        })
      );

      setUrls(Object.fromEntries(entries));
    }

    if (photos.length > 0) {
      loadUrls();
    }
  }, [photos]);

  // WARUNKI DOPIERO TUTAJ
  if (!isValidCategory) {
    return <div>Category not found</div>;
  }

  if (loading) {
    return <div>Loading…</div>;
  }

  if (photos.length === 0) {
    return <div>No photos in this category.</div>;
  }

  return (
    <div>
      <h1>{typedCategory}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {photos.map(photo => (
          <a key={photo.id} href={`/photo/${photo.slug}`}>
            <img
              src={urls[photo.id]}
              alt={photo.title}
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: 6 }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
