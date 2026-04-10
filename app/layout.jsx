import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "../src/index.css";
import ClientProviders from "../src/providers/ClientProviders";
import Nav from "../src/components/nav";

export const metadata = {
  title: "ali hatem ramadan",
  description:
    "يحتوي موقع الويب الخاص بالمحفظة هذا على معلومات عني ومهاراتي ومشاريعي كمطور للواجهة الأمامية.",
  metadataBase: new URL("https://ali-hatem-ramadan.vercel.app"),
  openGraph: {
    title: "ali hatem ramadan",
    description:
      "يحتوي موقع الويب الخاص بالمحفظة هذا على معلومات عني ومهاراتي ومشاريعي كمطور للواجهة الأمامية.",
    url: "https://ali-hatem-ramadan.vercel.app",
    images: ["/favicon.ico"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ClientProviders>
          <Nav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
