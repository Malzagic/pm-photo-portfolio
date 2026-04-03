import { useEffect, useState } from "react";
import { getPhotosByCategory } from "./photo.service";
export function usePublicPhotos(category) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const data = await getPhotosByCategory(category);
            setPhotos(data);
            setLoading(false);
        }
        load();
    }, [category]);
    return { photos, loading };
}
