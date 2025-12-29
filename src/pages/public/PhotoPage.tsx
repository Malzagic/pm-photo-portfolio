import { useParams } from "react-router-dom";
import { usePublicPhoto } from "@/features/photos/usePublicPhoto";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";

export function PhotoPage() {
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = slug ?? "";

  const { photo, loading } = usePublicPhoto(safeSlug);

  const [url, setUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    async function loadUrl() {
      if (photo?.storagePath) {
        const downloadUrl = await getPhotoUrl(photo.storagePath);
        setUrl(downloadUrl);
      }
    }

    loadUrl();
  }, [photo]);

  if (!slug) {
    return <div>Invalid photo</div>;
  }

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!photo) {
    return <div>Photo not found</div>;
  }

  return (
    <div>
      <h1>{photo.title}</h1>

      {url && (
        <img
          src={url}
          alt={photo.title}
          onClick={() => setIsFullscreen(true)}
          style={{
            maxWidth: "100%",
            height: "auto",
            cursor: "zoom-in",
          }}
        />
      )}

      {isFullscreen && url && (
        <div
          onClick={() => setIsFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={url}
            alt={photo.title}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div>Category: {photo.category}</div>
        {photo.location && <div>Location: {photo.location}</div>}
      </div>
    </div>
  );
}
