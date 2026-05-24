import { cookies, headers } from "next/headers";

const normalizeLocale = (value = "") => {
  const normalized = value.toLowerCase();

  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("en")) return "en";

  return "";
};

const parseAcceptLanguage = (value = "") => {
  if (!value) return "";

  const entries = value.split(",");

  for (const entry of entries) {
    const locale = normalizeLocale(entry.trim());
    if (locale) return locale;
  }

  return "";
};

export const getRequestLocale = async () => {
  const cookieStore = await cookies();
  const cookieValue =
    typeof cookieStore?.get === "function"
      ? cookieStore.get("i18nextLng")?.value
      : cookieStore?.i18nextLng?.value || cookieStore?.i18nextLng;
  const cookieLocale = normalizeLocale(cookieValue || "");

  if (cookieLocale) return cookieLocale;

  const headerStore = await headers();
  const headerLocale = parseAcceptLanguage(
    headerStore.get("accept-language") || "",
  );

  return headerLocale || "en";
};
