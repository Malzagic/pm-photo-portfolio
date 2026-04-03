import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFeaturedPhotos } from "@/features/photos/useFeaturedPhotos";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { setSEO } from "@/lib/seo";
/**
 * HomePage component.
 * Displays a curated selection of featured photos.
 * Minimalist "Street" aesthetic with high-impact visuals and subtle typography.
 */
export function HomePage() {
    const { photos, loading } = useFeaturedPhotos();
    const [urls, setUrls] = useState({});
    // SEO effect for a professional landing page
    useEffect(() => {
        setSEO("Home", "Selected works from my photography portfolio.", {
            title: "Featured Works | PM Photography",
            description: "Explore a curated collection of street, astro, and landscape photography.",
        });
    }, []);
    // Fetch photo URLs from Mikrus server
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
    if (loading) {
        return (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
        {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton" style={{ paddingTop: "125%", borderRadius: 4 }}/>))}
      </div>);
    }
    if (photos.length === 0) {
        return (<div style={{ padding: "4rem", textAlign: "center", opacity: 0.5 }}>
        <p style={{ letterSpacing: "2px", fontSize: "0.8rem" }}>CURATING NEW CONTENT</p>
      </div>);
    }
    return (<div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* HERO SECTION: Minimalist Branding */}
      <header style={{ marginBottom: "5rem", marginTop: "2rem" }}>
        <h1 style={{
            fontSize: "0.7rem",
            letterSpacing: "5px",
            textTransform: "uppercase",
            opacity: 0.4,
            margin: "0 0 1rem 0",
            fontWeight: 600,
        }}>
          Selected Works
        </h1>
        <p style={{
            fontSize: "1.5rem",
            maxWidth: "600px",
            lineHeight: "1.4",
            fontWeight: 300,
            opacity: 0.9,
        }}>
          Capturing the silence between the noise. <br />
          <span style={{ opacity: 0.4 }}>A visual archive of light and shadows.</span>
        </p>
      </header>

      {/* FEATURED GRID: Larger, high-impact cards */}
      <div style={{
            display: "grid",
            // Larger minimum width for a more premium look than standard categories
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: 40,
            rowGap: 80, // More vertical "breathing" space
        }}>
        {photos.map((photo, index) => (<Link key={photo.id} to={`/photo/${photo.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              {/* Indexing for that "museum catalog" feel */}
              <span style={{
                position: "absolute",
                top: -15,
                left: 0,
                fontSize: "0.6rem",
                fontFamily: "monospace",
                opacity: 0.2,
            }}>
                [ {String(index + 1).padStart(2, "0")} ]
              </span>

              <img src={urls[photo.id]} alt={photo.title} loading="lazy" style={{
                width: "100%",
                height: "auto",
                borderRadius: 2, // Sharp, professional edges
                display: "block",
                aspectRatio: photo.aspectRatio ? `${photo.aspectRatio}` : "auto",
                objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }} className="photo-clickable" onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}/>

              <div style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
            }}>
                <h2 style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                margin: 0,
                letterSpacing: "0.5px",
            }}>
                  {photo.title}
                </h2>
                <span style={{
                fontSize: "0.7rem",
                opacity: 0.3,
                textTransform: "uppercase",
                fontFamily: "monospace",
            }}>
                  {photo.category}
                </span>
              </div>
            </div>
          </Link>))}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <footer style={{ marginTop: "10rem", marginBottom: "4rem", textAlign: "center" }}>
        <Link to="/portfolio" style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#fff",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "8px",
            opacity: 0.6,
        }}>
          View Full Portfolio
        </Link>
      </footer>
    </div>);
}
