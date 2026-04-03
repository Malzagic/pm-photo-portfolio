import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSEO } from "@/lib/seo";
import { useCategories } from "@/features/categories/useCategories";
/**
 * PortfolioPage component.
 * Displays category tiles using a strict grid layout.
 * Fixed: Uses auto-fill to prevent single items from stretching.
 */
export function PortfolioPage() {
    const { categories, loading, error } = useCategories();
    useEffect(() => {
        setSEO("Portfolio", "Professional photography portfolio categories.", {
            title: "Portfolio | PM Photography",
            description: "Explore various photography genres including Astro and Landscape.",
        });
    }, []);
    if (loading)
        return <div style={{ opacity: 0.5 }}>Loading...</div>;
    if (error)
        return <div>Error loading categories</div>;
    return (<div>
      {/* Restored: Original header style */}
      <h1 style={{ fontSize: "1.2rem", opacity: 0.7, marginBottom: "2rem" }}>Portfolio Categories</h1>

      <div style={{
            display: "grid",
            /** * CRITICAL FIX: Changed auto-fit to auto-fill.
             * This ensures tiles stay small (min 260px) even if there is only one.
             */
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
        }}>
        {categories.map(category => (<Link key={category.id} to={`/portfolio/${category.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="photo-clickable" style={{
                width: "100%",
                // Restored: Classic 3:2 photography ratio
                aspectRatio: "3 / 2",
                borderRadius: 6,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                transition: "background 0.2s ease",
            }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 400, margin: "0 0 8px 0" }}>{category.name}</h2>
              <p style={{ opacity: 0.4, fontSize: "0.85rem", textAlign: "center", margin: 0 }}>
                {/* Fallback description if not provided in DB */}
                {category.slug === "astro"
                ? "Deep space, stars and celestial events."
                : `Explore my ${category.name} collection.`}
              </p>
            </div>
          </Link>))}
      </div>
    </div>);
}
