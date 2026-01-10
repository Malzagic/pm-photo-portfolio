import { useEffect, useState } from "react";
import { getPhotoBySlug } from "./photo.queries";
export function usePublicPhoto(slug) {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const data = await getPhotoBySlug(slug);
            setPhoto(data);
            setLoading(false);
        }
        load();
    }, [slug]);
    return { photo, loading };
}
