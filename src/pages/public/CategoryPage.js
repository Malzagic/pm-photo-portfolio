import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePublicPhotos } from "@/features/photos/usePublicPhotos";
import { useCategories } from "@/features/categories/useCategories";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { setSEO } from "@/lib/seo";
export function CategoryPage() {
    const { category: urlSlug } = useParams();
    const { categories, loading: catsLoading } = useCategories();
    const currentCategory = categories.find(c => c.slug === urlSlug);
    const isValidCategory = !!currentCategory;
    const { photos, loading: photosLoading } = usePublicPhotos(urlSlug || "");
    const [urls, setUrls] = useState({});
    useEffect(() => {
        if (!isValidCategory || !currentCategory)
            return;
        setSEO(`${currentCategory.name}`, `Collection: ${currentCategory.name}`, {
            title: `${currentCategory.name} | Archive`,
            description: `View the ${currentCategory.name} photography series.`,
        });
    }, [currentCategory, isValidCategory]);
    useEffect(() => {
        async function loadUrls() {
            const entries = await Promise.all(photos.map(async (photo) => {
                const url = await getPhotoUrl(photo.storagePath);
                return [photo.id, url];
            }));
            setUrls(Object.fromEntries(entries));
        }
        if (photos.length > 0)
            loadUrls();
    }, [photos]);
    if (catsLoading || photosLoading)
        return <div className="skeleton" style={{ height: "60vh" }}/>;
    if (!isValidCategory)
        return <div style={{ padding: "2rem", opacity: 0.5 }}>Series not found.</div>;
    return (<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem", borderLeft: "2px solid #fff", paddingLeft: "1rem" }}>
        <h1 style={{ fontSize: "0.9rem", letterSpacing: "3px", textTransform: "uppercase", opacity: 0.8, margin: 0 }}>
          Series: {currentCategory.name}
        </h1>
        <span style={{ fontSize: "0.7rem", opacity: 0.3 }}>{photos.length} Assets in collection</span>
      </header>

      {photos.length === 0 ? (<p style={{ opacity: 0.4, fontSize: "0.8rem" }}>Archive is empty.</p>) : (<div style={{
                display: "grid",
                // FIXED: Smaller thumbnails (160px) to create a "collection" feel
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px",
            }}>
          {photos.map(photo => (<Link key={photo.id} to={`/photo/${photo.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className="thumbnail-wrapper" style={{ overflow: "hidden", background: "#111" }}>
                <img src={urls[photo.id]} alt={photo.title} loading="lazy" style={{
                    width: "100%",
                    // Square aspect ratio for the "contact sheet" look
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(20%)", // Subtle street photography vibe
                    transition: "transform 0.4s ease, filter 0.4s ease",
                }} className="photo-clickable" onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.filter = "grayscale(0%)";
                }} onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "grayscale(20%)";
                }}/>
              </div>
              <div style={{
                    marginTop: "6px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    opacity: 0.3,
                }}>
                {photo.title}
              </div>
            </Link>))}
        </div>)}
    </div>);
}
