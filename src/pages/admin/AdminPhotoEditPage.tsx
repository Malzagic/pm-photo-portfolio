import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAdminPhoto } from "@/features/photos/useAdminPhoto";
import { updatePhoto } from "@/features/photos/photo.service";
import type { PhotoCategory } from "@/features/photos/photo.types";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Form shape for editing a photo.
 * This is the single source of truth for the form data.
 */
type PhotoFormData = {
  title: string;
  category: PhotoCategory;
  published: boolean;
  featured: boolean;
};

export function AdminPhotoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch photo data from Firestore
  const { photo, loading } = useAdminPhoto(id ?? "");
  const photoId = photo?.id;

  /**
   * React Hook Form setup.
   * defaultValues are placeholders and will be replaced
   * once the async photo data is loaded.
   */
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PhotoFormData>({
    defaultValues: {
      title: "",
      category: "astro",
      published: true,
      featured: false,
    },
  });

  /**
   * Synchronize async photo data with the form.
   * reset() is the recommended way to populate a form
   * after data has been loaded.
   */
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

  // Loading state – skeleton provides better UX than plain text
  if (loading) {
    return <Skeleton height={300} />;
  }

  // Invalid or missing photo
  if (!photo) {
    return <div>Photo not found</div>;
  }

  /**
   * Form submit handler.
   * Uses RHF formState to manage submitting state.
   */
  async function onSubmit(data: PhotoFormData) {
    if (!photoId) {
      // This should never happen, but keeps TypeScript and runtime safe
      return;
    }
    await updatePhoto(photoId, {
      title: data.title,
      slug: data.title.toLowerCase().trim().replace(/\s+/g, "-"),
      category: data.category,
      published: data.published,
      featured: data.featured,
    });

    // Navigate back to admin list after successful save
    navigate("/admin");
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Edit photo</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* TITLE */}
        <label style={{ display: "block", marginBottom: 16 }}>
          <div>Title</div>
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
            })}
            disabled={isSubmitting}
          />
          {errors.title && <p style={{ color: "red", marginTop: 4 }}>{errors.title.message}</p>}
        </label>

        {/* CATEGORY */}
        <label style={{ display: "block", marginBottom: 16 }}>
          <div>Category</div>
          <select {...register("category")} disabled={isSubmitting}>
            <option value="astro">Astro</option>
            <option value="landscape">Landscape</option>
            <option value="nature">Nature</option>
          </select>
        </label>

        {/* FLAGS */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block" }}>
            <input type="checkbox" {...register("published")} disabled={isSubmitting} />
            Published
          </label>

          <label style={{ display: "block" }}>
            <input type="checkbox" {...register("featured")} disabled={isSubmitting} />
            Featured
          </label>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </button>

          <button type="button" onClick={() => navigate("/admin")} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
