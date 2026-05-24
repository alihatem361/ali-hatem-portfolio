import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "../src/index.css";
import ClientProviders from "../src/providers/ClientProviders";
import Nav from "../src/components/nav";
import { getRequestLocale } from "./lib/locale";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ali-hatem-ramadan.vercel.app";

const METADATA_BY_LOCALE = {
  en: {
    title: {
      default: "Abdulrahman Hatem | Flutter Mobile App Developer",
      template: "%s | Abdulrahman Hatem",
    },
    description:
      "Portfolio of Abdulrahman Hatem, a Flutter mobile application developer. Explore apps, case studies, and contact.",
    applicationName: "Abdulrahman Hatem Portfolio",
    keywords: [
      "Abdulrahman Hatem",
      "Flutter developer",
      "mobile application developer",
      "Flutter apps",
      "Dart",
      "mobile UI",
      "app portfolio",
      "case studies",
    ],
    openGraphLocale: "en_US",
  },
  ar: {
    title: {
      default: "عبدالرحمن حاتم | مطور تطبيقات Flutter",
      template: "%s | عبدالرحمن حاتم",
    },
    description:
      "ملف أعمال عبدالرحمن حاتم، مطور تطبيقات Flutter للهواتف. استعرض التطبيقات ودراسات الحالة وطرق التواصل.",
    applicationName: "ملف أعمال عبدالرحمن حاتم",
    keywords: [
      "عبدالرحمن حاتم",
      "مطور Flutter",
      "مطور تطبيقات الجوال",
      "تطبيقات Flutter",
      "Dart",
      "واجهة مستخدم",
      "أعمال التطبيقات",
      "دراسات حالة",
    ],
    openGraphLocale: "ar_EG",
  },
};

const getLocaleMetadata = (locale) =>
  METADATA_BY_LOCALE[locale] || METADATA_BY_LOCALE.en;

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const localized = getLocaleMetadata(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: localized.title,
    description: localized.description,
    applicationName: localized.applicationName,
    keywords: localized.keywords,
    authors: [
      {
        name: "Abdulrahman Hatem",
        url: SITE_URL,
      },
    ],
    creator: "Abdulrahman Hatem",
    publisher: "Abdulrahman Hatem",
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: localized.title.default,
      description: localized.description,
      url: "/",
      siteName: "Abdulrahman Hatem",
      images: [
        {
          url: "/favicon.ico",
          alt: localized.title.default,
        },
      ],
      type: "website",
      locale: localized.openGraphLocale,
    },
    twitter: {
      card: "summary",
      title: localized.title.default,
      description: localized.description,
      images: ["/favicon.ico"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  const locale = await getRequestLocale();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ClientProviders>
          <Nav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
