import { useEffect, useState } from "react";
import { getAllPhotos } from "./photo.queries";
export function useAdminPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const data = await getAllPhotos();
                setPhotos(data);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message || "Failed to load photos");
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    return { photos, loading, error };
}
