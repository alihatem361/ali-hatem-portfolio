export const handleDownloadCv = (CvLink, CVName) => {
  fetch(CvLink, {
    headers: {
      Origin: window.location.origin,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = CVName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => console.error(error));
};

export const createSlug = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const resolvePublicAssetPath = (assetPath = "") => {
  if (!assetPath) {
    return undefined;
  }

  if (assetPath.startsWith("http") || assetPath.startsWith("data:")) {
    return assetPath;
  }

  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
};
