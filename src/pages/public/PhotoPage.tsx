import { useParams } from "react-router-dom";
import { usePublicPhoto } from "@/features/photos/usePublicPhoto";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";
import { setSEO } from "@/lib/seo";

export function PhotoPage() {
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = slug ?? "";

  const { photo, loading } = usePublicPhoto(safeSlug);

  const [url, setUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // SEO effect
  useEffect(() => {
    if (!photo || !url) return;

    setSEO(`${photo.title} – Photography`, `${photo.title}. ${photo.category} photography.`, {
      title: `${photo.title} – Photography`,
      description: `${photo.title}. ${photo.category} photography.`,
      image: url,
      url: window.location.href,
    });
  }, [photo, url]);

  // Load photo URL
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
    return (
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "60vh",
        }}
      />
    );
  }

  if (!photo) {
    return <p style={{ opacity: 0.6 }}>New work coming soon.</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 16 }}>{photo.title}</h1>

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
          className="photo-clickable"
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
          }}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "none",
              color: "#fff",
              fontSize: 24,
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

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
        <div>
          Category: <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>{photo.category}</p>
        </div>
        {photo.location && <div>Location: {photo.location}</div>}
      </div>
    </div>
  );
}
