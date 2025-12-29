import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadWebPhoto } from "@/features/photos/photo.storage";
import type { PhotoCategory } from "@/features/photos/photo.types";
import { createPhoto, updatePhoto } from "@/features/photos/photo.service";
import { getImageAspectRatio } from "@/features/photos/photo.image";
import { serverTimestamp } from "firebase/firestore";

export function AdminPhotoCreatePage() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("astro");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file || !title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    try {
      const ratio = await getImageAspectRatio(file);
      const photoId = await createPhoto({
        title,
        slug: title.toLowerCase().trim().replace(/\s+/g, "-"),
        category,
        published,
        featured,
        aspectRatio: ratio,
        storagePath: "",
        takenAt: serverTimestamp(),
      });

      const { storagePath } = await uploadWebPhoto(file, photoId);

      await updatePhoto(photoId, {
        storagePath,
      });

      navigate("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Add photo</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />

        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />

        <select value={category} onChange={e => setCategory(e.target.value as PhotoCategory)}>
          <option value="astro">Astro</option>
          <option value="landscape">Landscape</option>
          <option value="nature">Nature</option>
        </select>

        <label>
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
          Published
        </label>

        <label>
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
          Featured
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading…" : "Save"}
        </button>
      </form>
    </div>
  );
}
