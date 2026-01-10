interface OpenGraphOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

function setOgTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export function setSEO(title: string, description?: string, og?: OpenGraphOptions) {
  document.title = title;

  if (description) {
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

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
