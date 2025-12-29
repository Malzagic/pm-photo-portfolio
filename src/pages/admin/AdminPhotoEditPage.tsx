import { useParams, useNavigate } from "react-router-dom";
import { useAdminPhoto } from "@/features/photos/useAdminPhoto";
import { updatePhoto } from "@/features/photos/photo.service";
import type { PhotoCategory } from "@/features/photos/photo.types";
import { useState } from "react";

export function AdminPhotoEditPage() {
  const params = useParams<{ id: string }>();
  const photoId = params.id ?? "";

  const navigate = useNavigate();

  // HOOKI ZAWSZE NA GÓRZE
  const { photo, loading } = useAdminPhoto(photoId);

  const [formData, setFormData] = useState({
    title: photo?.title ?? "",
    category: (photo?.category ?? "astro") as PhotoCategory,
    published: photo?.published ?? true,
    featured: photo?.featured ?? false,
  });

  // WARUNKI DOPIERO TUTAJ
  if (!photoId) {
    return <div>Invalid photo id</div>;
  }

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!photo) {
    return <div>Photo not found</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await updatePhoto(photoId, {
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
      category: formData.category,
      published: formData.published,
      featured: formData.featured,
    });

    navigate("/admin");
  }

  return (
    <div>
      <h1>Edit photo</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </label>

        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value as PhotoCategory })}
        >
          <option value="astro">Astro</option>
          <option value="landscape">Landscape</option>
          <option value="nature">Nature</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={e => setFormData({ ...formData, published: e.target.checked })}
          />
          Published
        </label>

        <label>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
          />
          Featured
        </label>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
