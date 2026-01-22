import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Ali Hatem | Senior Frontend Developer (React & Next.js)",
  description = "Ali Hatem is a Senior Frontend Developer from Egypt specializing in React.js, Next.js, and modern web technologies. Explore my portfolio of professional projects and technical expertise.",
  canonicalUrl = "https://ali-hatem-portfolio.vercel.app/",
  ogImage = "https://ali-hatem-portfolio.vercel.app/images/og-image.webp",
}) => {
  // JSON-LD Structured Data for Person
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ali Hatem",
    jobTitle: "Senior Frontend Developer",
    url: "https://ali-hatem-portfolio.vercel.app/",
    image: "https://ali-hatem-portfolio.vercel.app/images/og-image.webp",
    sameAs: [
      "https://github.com/alihatem360",
      "https://www.linkedin.com/in/alihatem360/",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Giza",
      addressCountry: "Egypt",
    },
    knowsAbout: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Frontend Development",
      "Web Development",
      "UI/UX",
      "Tailwind CSS",
    ],
    description: description,
  };

  // JSON-LD Structured Data for Website
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ali Hatem Portfolio",
    url: "https://ali-hatem-portfolio.vercel.app/",
    author: {
      "@type": "Person",
      name: "Ali Hatem",
    },
    description: description,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
