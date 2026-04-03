import { useParams, useNavigate } from "react-router-dom";
import { usePublicPhoto } from "@/features/photos/usePublicPhoto";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";
import { setSEO } from "@/lib/seo";
export function PhotoPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { photo, loading } = usePublicPhoto(slug ?? "");
    const [url, setUrl] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        if (!photo || !url)
            return;
        setSEO(`${photo.title}`, `Street photography asset: ${photo.title}`, {
            title: `${photo.title} | PM`,
            description: `Street photography asset: ${photo.title}`,
            image: url,
        });
    }, [photo, url]);
    useEffect(() => {
        async function loadUrl() {
            if (photo?.storagePath) {
                const downloadUrl = await getPhotoUrl(photo.storagePath);
                setUrl(downloadUrl);
            }
        }
        loadUrl();
    }, [photo]);
    if (loading)
        return <div className="skeleton" style={{ width: "100%", height: "80vh" }}/>;
    if (!photo)
        return <div style={{ padding: "4rem", opacity: 0.5 }}>Asset not found.</div>;
    return (<div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* NAVIGATION BACK */}
      <button onClick={() => navigate(-1)} style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            opacity: 0.4,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "2rem",
            width: "fit-content",
        }}>
        ← Back to Series
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "end" }}>
        <div style={{ position: "relative" }}>
          {url && (<img src={url} alt={photo.title} onClick={() => setIsFullscreen(true)} style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                cursor: "zoom-in",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}/>)}
        </div>

        {/* METADATA: RAW MONOSPACE STYLE */}
        <aside style={{
            writingMode: "vertical-rl",
            textTransform: "uppercase",
            letterSpacing: "4px",
            fontSize: "0.65rem",
            opacity: 0.3,
            fontFamily: "monospace",
        }}>
          {photo.title} // {photo.category} // {photo.location || "Unknown Loc"}
     // {photo.category} // {photo.location || "Unknown Loc"}
     // {photo.location || "Unknown Loc"}
        </aside>
      </div>

      {/* FULLSCREEN OVERLAY */}
      {isFullscreen && url && (<div onClick={() => setIsFullscreen(false)} style={{
                position: "fixed",
                inset: 0,
                background: "#000", // Solid black for zero distraction
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                cursor: "zoom-out",
            }}>
          <img src={url} alt={photo.title} style={{ maxWidth: "95vw", maxHeight: "95vh", objectFit: "contain" }}/>
          <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "#fff",
                fontSize: "10px",
                letterSpacing: "2px",
                opacity: 0.5,
            }}>
            {photo.title.toUpperCase()}
          </div>
        </div>)}
    </div>);
}
