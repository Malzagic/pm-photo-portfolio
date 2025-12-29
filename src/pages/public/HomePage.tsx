import { useFeaturedPhotos } from "@/features/photos/useFeaturedPhotos";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";

export function HomePage() {
  const { photos, loading } = useFeaturedPhotos();
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

  if (loading) {
    return <div>Loading…</div>;
  }

  if (photos.length === 0) {
    return <div>No featured photos yet.</div>;
  }

  return (
    <div>
      <h1>Photography</h1>

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
