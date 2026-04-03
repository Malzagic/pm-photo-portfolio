/**
 * src/features/photos/photo.storage.ts
 * Dynamic storage service using environment variables.
 * Automatically switches between Localhost and Mikrus Server.
 */
// Vite uses import.meta.env to access variables prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const urlCache = new Map();
/**
 * Uploads a photo to the custom server (Mikrus in production).
 */
export async function uploadWebPhoto(file, idToken) {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to upload photo to custom server");
    }
    const data = await response.json();
    // Construct the public URL using the dynamic base URL
    const publicUrl = `${API_BASE_URL}/uploads/${data.storagePath}`;
    return {
        storagePath: data.storagePath,
        url: publicUrl,
    };
}
/**
 * Returns the public URL for a given storage path.
 * Effectively handles legacy Firebase URLs and new local storage paths.
 */
export async function getPhotoUrl(storagePath) {
    const cached = urlCache.get(storagePath);
    if (cached)
        return cached;
    // If path starts with http, it's likely an old Firebase URL
    const url = storagePath.startsWith("http") ? storagePath : `${API_BASE_URL}/uploads/${storagePath}`;
    urlCache.set(storagePath, url);
    return url;
}
/**
 * Deletes a photo from the custom server.
 */
export async function deleteWebPhoto(storagePath, idToken) {
    // We use the dynamic API_BASE_URL to reach the correct endpoint
    const response = await fetch(`${API_BASE_URL}/api/photos/${storagePath}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete photo from custom server");
    }
    urlCache.delete(storagePath);
}
