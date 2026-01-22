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

/**
 * Creates a URL-friendly slug from a project title
 * @param {string} title - The project title
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (title) => {
  if (!title) return "";

  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};
