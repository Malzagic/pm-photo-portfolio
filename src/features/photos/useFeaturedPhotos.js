import { useEffect, useState } from "react";
import { getFeaturedPhotos } from "./photo.queries";
export function useFeaturedPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const data = await getFeaturedPhotos();
            setPhotos(data);
            setLoading(false);
        }
        load();
    }, []);
    return { photos, loading };
}
