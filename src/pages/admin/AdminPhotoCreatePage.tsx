import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { useCategories } from "@/features/categories/useCategories"; // NEW: Dynamic categories hook
import { uploadWebPhoto } from "@/features/photos/photo.storage";
import { createPhoto, updatePhoto } from "@/features/photos/photo.service";
import { getImageAspectRatio } from "@/features/photos/photo.image";
import { serverTimestamp } from "firebase/firestore";

/**
 * AdminPhotoCreatePage component.
 * Handles photo uploads to Firebase Storage and metadata storage in Firestore.
 * Now fully integrated with dynamic categories.
 */
export function AdminPhotoCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Fetch dynamic categories from the CMS
  const { categories, loading: catsLoading } = useCategories();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // Initialized as empty
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Effect to set the default category once they are loaded from Firestore.
   */
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].slug);
    }
  }, [categories, category]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Basic validation including dynamic category check
    if (!file || !title.trim() || !category) {
      alert("Title, image, and category are required.");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload photos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Calculate aspect ratio for professional grid rendering
      const ratio = await getImageAspectRatio(file);

      // 2. Execute the upload directly to Firebase Storage
      const { storagePath } = await uploadWebPhoto(file);

      // 3. Initialize Firestore document with the selected dynamic category
      const photoId = await createPhoto({
        title,
        slug: title.toLowerCase().trim().replace(/\s+/g, "-"),
        category,
        published,
        featured,
        aspectRatio: ratio,
        storagePath: "", // Placeholder for server response
        takenAt: serverTimestamp(),
      });

      // 4. Finalize the document with the real storage path
      await updatePhoto(photoId, {
        storagePath,
      });

      navigate("/admin");
    } catch (error) {
      console.error("Upload process failed:", error);
      alert("Something went wrong during the upload process.");
    } finally {
      setLoading(false);
    }
  }

  // Prevent form rendering while categories are initializing for better UX
  if (catsLoading) {
    return <div style={{ opacity: 0.5, padding: "2rem" }}>Initializing CMS...</div>;
  }

  return (
    <div className="admin-create-page">
      <h1 style={{ fontSize: "1.5rem", marginBottom: "2rem", opacity: 0.8 }}>Add New Photo</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400 }}>
        {/* IMAGE UPLOAD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: "0.9rem", opacity: 0.6 }}>Image File</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} disabled={loading} />
        </div>

        {/* PHOTO TITLE */}
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
          }}
        />

        {/* DYNAMIC CATEGORY SELECTOR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: "0.9rem", opacity: 0.6 }}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            disabled={loading}
            style={{
              padding: "10px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {categories.length === 0 && <option value="">No categories available</option>}
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* PUBLICATION FLAGS */}
        <div style={{ display: "flex", gap: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              disabled={loading}
            />
            Published
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              disabled={loading}
            />
            Featured
          </label>
        </div>

        {/* ACTION BUTTON */}
        <button
          type="submit"
          disabled={loading || categories.length === 0}
          style={{
            marginTop: 20,
            padding: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#333" : "#fff",
            color: loading ? "#666" : "#000",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {loading ? "Processing..." : "Save Photo"}
        </button>
      </form>
    </div>
  );
}
