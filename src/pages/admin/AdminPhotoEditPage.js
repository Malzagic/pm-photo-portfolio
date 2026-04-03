import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAdminPhoto } from "@/features/photos/useAdminPhoto";
import { updatePhoto } from "@/features/photos/photo.service";
import { useCategories } from "@/features/categories/useCategories"; // NEW
import { useAuth } from "@/features/auth/useAuth";
import { Skeleton } from "@/components/ui/Skeleton";
export function AdminPhotoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { photo, loading: photoLoading } = useAdminPhoto(id ?? "");
    const { categories, loading: catsLoading } = useCategories(); // Fetch dynamic categories
    const photoId = photo?.id;
    const { register, handleSubmit, reset, formState: { isSubmitting, errors }, } = useForm({
        defaultValues: {
            title: "",
            category: "",
            published: true,
            featured: false,
        },
    });
    useEffect(() => {
        if (photo) {
            reset({
                title: photo.title,
                category: photo.category,
                published: photo.published,
                featured: photo.featured,
            });
        }
    }, [photo, reset]);
    async function onSubmit(data) {
        if (!photoId || !user)
            return;
        try {
            await updatePhoto(photoId, {
                title: data.title,
                slug: data.title.toLowerCase().trim().replace(/\s+/g, "-"),
                category: data.category,
                published: data.published,
                featured: data.featured,
            });
            navigate("/admin");
        }
        catch (error) {
            console.error("Failed to update photo:", error);
            alert("Error updating photo document.");
        }
    }
    // Combined loading state
    if (photoLoading || catsLoading) {
        return (<div style={{ maxWidth: 420 }}>
        <Skeleton height={40}/>
        <Skeleton height={300}/>
      </div>);
    }
    if (!photo)
        return <div style={{ opacity: 0.6 }}>Photo asset not found.</div>;
    return (<div style={{ maxWidth: 420 }} className="admin-edit-container">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "2rem", opacity: 0.8 }}>Edit Photo Details</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* TITLE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: "0.85rem", opacity: 0.5 }}>Title</label>
          <input type="text" disabled={isSubmitting} style={{
            padding: "12px",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
        }} {...register("title", { required: "Title is required" })}/>
          {errors.title && <span style={{ color: "#ff4444", fontSize: "0.75rem" }}>{errors.title.message}</span>}
        </div>

        {/* DYNAMIC CATEGORY SELECT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: "0.85rem", opacity: 0.5 }}>Category</label>
          <select disabled={isSubmitting} style={{
            padding: "12px",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#111",
            color: "#fff",
        }} {...register("category", { required: "Category is required" })}>
            <option value="" disabled>
              Select category
            </option>
            {categories.map(cat => (<option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>))}
          </select>
        </div>

        {/* FLAGS & BUTTONS (SAME AS BEFORE) */}
        <div style={{ display: "flex", gap: 24, padding: "10px 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.9rem" }}>
            <input type="checkbox" {...register("published")}/> Published
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.9rem" }}>
            <input type="checkbox" {...register("featured")}/> Featured
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: "1rem" }}>
          <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: "12px", borderRadius: 4, background: "#fff", color: "#000", fontWeight: 600 }}>
            {isSubmitting ? "Saving..." : "Update Metadata"}
          </button>
          <button type="button" onClick={() => navigate("/admin")} style={{
            padding: "12px 20px",
            borderRadius: 4,
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
        }}>
            Cancel
          </button>
        </div>
      </form>
    </div>);
}
