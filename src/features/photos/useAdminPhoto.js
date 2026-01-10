import { useEffect, useState } from "react";
import { getPhotoById } from "./photo.queries";
export function useAdminPhoto(photoId) {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const data = await getPhotoById(photoId);
            setPhoto(data);
            setLoading(false);
        }
        load();
    }, [photoId]);
    return { photo, loading };
}
