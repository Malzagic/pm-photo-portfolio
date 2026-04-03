import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminPhotos } from "@/features/photos/useAdminPhotos";
import { getPhotoUrl } from "@/features/photos/photo.storage";
import { deletePhoto } from "@/features/photos/photo.actions";
import { useAuth } from "@/features/auth/useAuth";

/**
 * AdminPhotosPage component.
 * Displays a list of all photos with management actions (Edit, Delete).
 * Strictly follows the project's minimalist design and security rules.
 */
export function AdminPhotosPage() {
  const { photos, loading, error } = useAdminPhotos();
  const { user } = useAuth();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /**
   * Handles the secure deletion of a photo from both the server and Firestore.
   */
  async function handleDelete(photoId: string, storagePath: string) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this photo from the server and database?",
    );
    if (!confirmed) return;

    setActionLoading(photoId);
    try {
      // Get fresh ID token for the Mikrus server verification
      const idToken = await user.getIdToken();

      // Execute the delete action (Storage + Firestore)
      await deletePhoto({ id: photoId, storagePath }, idToken);

      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Failed to delete photo. Check console for details.");
    } finally {
      setActionLoading(null);
    }
  }

  /**
   * Load public URLs for photo thumbnails from the custom server.
   */
  useEffect(() => {
    async function loadUrls() {
      const entries = await Promise.all(
        photos
          .filter(p => p.storagePath)
          .map(async photo => {
            const url = await getPhotoUrl(photo.storagePath);
            return [photo.id, url] as const;
          }),
      );

      setUrls(Object.fromEntries(entries));
    }

    if (photos.length > 0) {
      loadUrls();
    }
  }, [photos]);

  if (loading) return <div style={{ opacity: 0.6, padding: "2rem" }}>Loading professional assets...</div>;
  if (error) return <div style={{ color: "#ff4444", padding: "2rem" }}>Error: {error}</div>;

  return (
    <div className="admin-photos-container">
      {/* Header section with Add Photo trigger */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400, opacity: 0.8 }}>Photo Management</h1>

        <Link
          to="/admin/photos/create"
          style={{
            padding: "10px 20px",
            background: "#fff",
            color: "#000",
            textDecoration: "none",
            borderRadius: 4,
            fontWeight: 600,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          + Add New Photo
        </Link>
      </header>

      {photos.length === 0 ? (
        <p style={{ opacity: 0.5, textAlign: "center", marginTop: "4rem" }}>
          Your portfolio is currently empty. Start by adding your first masterpiece.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {photos.map(photo => (
            <div
              key={photo.id}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr auto",
                gap: 20,
                alignItems: "center",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "border 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
            >
              {/* Thumbnail Preview */}
              <div style={{ width: 100, height: 60, borderRadius: 4, overflow: "hidden", background: "#111" }}>
                {urls[photo.id] ? (
                  <img src={urls[photo.id]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#222" }} />
                )}
              </div>

              {/* Photo Details */}
              <div>
                <strong style={{ display: "block", fontSize: "1rem", marginBottom: 4 }}>
                  {photo.title || "Untitled Artwork"}
                </strong>
                <div style={{ fontSize: "0.8rem", opacity: 0.5, display: "flex", gap: 12 }}>
                  <span>{photo.category.toUpperCase()}</span>
                  <span>{photo.published ? "● Published" : "○ Draft"}</span>
                  {photo.featured && <span style={{ color: "#ffd700" }}>★ Featured</span>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  to={`/admin/photos/${photo.id}`}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    opacity: 0.6,
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(photo.id, photo.storagePath)}
                  disabled={actionLoading === photo.id}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    padding: 0,
                    opacity: actionLoading === photo.id ? 0.3 : 0.8,
                  }}
                >
                  {actionLoading === photo.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
