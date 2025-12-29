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

      <ul>
        {photos.map(photo => (
          <li key={photo.id} style={{ display: "flex", gap: 12 }}>
            {urls[photo.id] && <img src={urls[photo.id]} alt={photo.title} width={120} loading="lazy" />}

            <div>
              <strong>{photo.title}</strong>
              <div>{photo.category}</div>
              <div>{photo.published ? "✓ published" : "draft"}</div>
              <a href={`/admin/photos/${photo.id}`}>Edit</a>
              <button onClick={() => handleDelete(photo.id, photo.storagePath)} style={{ marginTop: 8 }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
