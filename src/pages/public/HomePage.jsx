import { useFeaturedPhotos } from "@/features/photos/useFeaturedPhotos";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { useEffect, useState } from "react";
import { setSEO } from "@/lib/seo";
export function HomePage() {
    const { photos, loading } = useFeaturedPhotos();
    const [urls, setUrls] = useState({});
    // SEO effect
    useEffect(() => {
        setSEO("Photography Portfolio", "Astrophotography, landscape and nature photography portfolio.", {
            title: "Photography Portfolio",
            description: "Selected astrophotography, landscape and nature photography.",
        });
    }, []);
    // Load photo URLs
    useEffect(() => {
        async function loadUrls() {
            const entries = await Promise.all(photos.map(async (photo) => {
                const url = await getPhotoUrl(photo.storagePath);
                return [photo.id, url];
            }));
            setUrls(Object.fromEntries(entries));
        }
        if (photos.length > 0) {
            loadUrls();
        }
    }, [photos]);
    if (loading) {
        return (<div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
            }}>
        {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="skeleton" style={{ paddingTop: "66%" }}/>))}
      </div>);
    }
    if (photos.length === 0) {
        return <p style={{ opacity: 0.6 }}>New work coming soon.</p>;
    }
    return (<div>
      <h1 style={{ fontSize: "1.2rem", opacity: 0.7 }}>Photography</h1>

      <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
        }}>
        {photos.map(photo => (<a key={photo.id} href={`/photo/${photo.slug}`}>
            <img src={urls[photo.id]} alt={photo.title} loading="lazy" style={{ width: "100%", height: "auto", borderRadius: 6 }} className="photo-clickable"/>
          </a>))}
      </div>
    </div>);
}
