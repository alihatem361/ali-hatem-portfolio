import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "../src/index.css";
import ClientProviders from "../src/providers/ClientProviders";
import Nav from "../src/components/nav";

export const metadata = {
  metadataBase: new URL("https://ali-hatem-ramadan.vercel.app"),
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
  authors: [
    {
      name: "Abdulrahman Hatem",
      url: "https://ali-hatem-ramadan.vercel.app",
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
    title: "Abdulrahman Hatem | Flutter Mobile App Developer",
    description:
      "Portfolio of Abdulrahman Hatem, a Flutter mobile application developer. Explore apps, case studies, and contact.",
    url: "/",
    siteName: "Abdulrahman Hatem",
    images: [
      {
        url: "/favicon.ico",
        alt: "Abdulrahman Hatem",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Abdulrahman Hatem | Flutter Mobile App Developer",
    description:
      "Portfolio of Abdulrahman Hatem, a Flutter mobile application developer. Explore apps, case studies, and contact.",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>
          <Nav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
