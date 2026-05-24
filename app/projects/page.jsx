import Projects from "../../src/components/projects";
import { getRequestLocale } from "../lib/locale";

const METADATA_BY_LOCALE = {
  en: {
    title: "Projects",
    description:
      "Browse Flutter and mobile application projects by Abdulrahman Hatem.",
  },
  ar: {
    title: "المشاريع",
    description: "تصفح مشاريع تطبيقات Flutter والجوال لعبدالرحمن حاتم.",
  },
};

const getLocaleMetadata = (locale) =>
  METADATA_BY_LOCALE[locale] || METADATA_BY_LOCALE.en;

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const localized = getLocaleMetadata(locale);

  return {
    title: localized.title,
    description: localized.description,
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: "/projects",
    },
    twitter: {
      card: "summary",
      title: localized.title,
      description: localized.description,
    },
  };
}

export default function ProjectsPage() {
  return <Projects />;
}
