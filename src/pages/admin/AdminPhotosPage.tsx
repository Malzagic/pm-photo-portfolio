import { useEffect, useState } from "react";
import { useAdminPhotos } from "@/features/photos/useAdminPhotos";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { deletePhoto } from "@/features/photos/photo.actions";

export function AdminPhotosPage() {
  const { photos, loading, error } = useAdminPhotos();
  const [urls, setUrls] = useState<Record<string, string>>({});

  async function handleDelete(photoId: string, storagePath: string) {
    const confirmed = window.confirm("Are you sure you want to permanently delete this photo?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePhoto({ id: photoId, storagePath });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete photo", error);
      alert("Failed to delete photo");
    }
  }

  useEffect(() => {
    async function loadUrls() {
      const entries = await Promise.all(
        photos
          .filter(p => p.storagePath)
          .map(async photo => {
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

  if (loading) return <div>Loading photos…</div>;
  if (error) return <div>{error}</div>;
  if (photos.length === 0) return <div>No photos yet.</div>;

  return (
    <div>
      <h1>Photos</h1>

      <div style={{ display: "grid", gap: 16 }}>
        {photos.map(photo => (
          <div
            key={photo.id}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 16,
              alignItems: "center",
              padding: 12,
              background: "#666",
              borderRadius: 6,
              border: "1px solid #e0e0e0",
            }}
          >
            {urls[photo.id] && (
              <img
                src={urls[photo.id]}
                alt=""
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            )}

            <div>
              <strong>{photo.title || "(no title)"}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{photo.category}</div>
              <div style={{ fontSize: 12 }}>
                {photo.published ? "✓ published" : "draft"}
                {photo.featured && " · featured"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <a href={`/admin/photos/${photo.id}`}>Edit</a>
              <button onClick={() => handleDelete(photo.id, photo.storagePath)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
