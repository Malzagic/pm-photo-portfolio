function setOgTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
    }
    meta.content = content;
}
export function setSEO(title, description, og) {
    document.title = title;
    if (description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.name = "description";
            document.head.appendChild(meta);
        }
        meta.content = description;
    }
    if (og) {
        setOgTag("og:title", og.title);
        setOgTag("og:description", og.description);
        setOgTag("og:type", "website");
        if (og.image) {
            setOgTag("og:image", og.image);
        }
        if (og.url) {
            setOgTag("og:url", og.url);
        }
    }
}
