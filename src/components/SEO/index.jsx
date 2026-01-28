import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://ali-hatem-portfolio.vercel.app";

const SEO = ({
  title = "Ali Hatem | Senior Frontend Developer - React & Next.js Expert",
  description = "Senior Frontend Developer from Egypt specializing in React.js, Next.js, TypeScript, and modern web technologies. 4+ years of experience building high-performance web applications. View my portfolio of 30+ professional projects.",
  canonicalUrl,
  ogImage = `${BASE_URL}/images/og-image.webp`,
  ogType = "website",
  article = null,
  project = null,
  noindex = false,
  keywords = "Ali Hatem, Frontend Developer, React Developer, Next.js Developer, JavaScript, TypeScript, Web Developer, Egypt, Portfolio",
  language = "en",
}) => {
  const location = useLocation();
  const url = canonicalUrl || `${BASE_URL}${location.pathname}`;

  // JSON-LD Structured Data for Person
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Ali Hatem Ramadan",
    givenName: "Ali",
    familyName: "Hatem",
    alternateName: ["Ali Hatem", "علي حاتم"],
    jobTitle: "Senior Frontend Developer",
    url: BASE_URL,
    image: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/og-image.webp`,
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://github.com/alihatem361",
      "https://www.linkedin.com/in/alihatem360/",
      "https://twitter.com/alihatem360",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Giza",
      addressRegion: "Giza Governorate",
      addressCountry: "EG",
    },
    nationality: {
      "@type": "Country",
      name: "Egypt",
    },
    knowsAbout: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Frontend Development",
      "Web Development",
      "UI/UX Design",
      "Tailwind CSS",
      "React Native",
      "Node.js",
      "REST APIs",
      "GraphQL",
    ],
    knowsLanguage: ["English", "Arabic"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Frontend Developer",
      occupationLocation: {
        "@type": "Country",
        name: "Egypt",
      },
      skills: "React.js, Next.js, TypeScript, JavaScript, Tailwind CSS",
    },
    description: description,
  };

  // JSON-LD Structured Data for Website
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Ali Hatem Portfolio",
    alternateName: "Ali Hatem - Frontend Developer Portfolio",
    url: BASE_URL,
    author: {
      "@id": `${BASE_URL}/#person`,
    },
    publisher: {
      "@id": `${BASE_URL}/#person`,
    },
    description: description,
    inLanguage: ["en", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/projects?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD for WebPage
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url: url,
    name: title,
    description: description,
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    author: {
      "@id": `${BASE_URL}/#person`,
    },
    inLanguage: language,
    dateModified: new Date().toISOString(),
  };

  // JSON-LD for Project/Portfolio Item
  const projectStructuredData = project
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${url}/#project`,
        name: project.title,
        description: project.description,
        url: url,
        image: project.image ? `${BASE_URL}/${project.image}` : ogImage,
        author: {
          "@id": `${BASE_URL}/#person`,
        },
        creator: {
          "@id": `${BASE_URL}/#person`,
        },
        dateCreated: project.dateCreated || new Date().toISOString(),
        keywords: project.technology?.join(", "),
        ...(project.demo && { mainEntityOfPage: project.demo }),
      }
    : null;

  // JSON-LD for ItemList (Projects Collection)
  const collectionStructuredData =
    ogType === "collection"
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}/#collection`,
          name: title,
          description: description,
          url: url,
          author: {
            "@id": `${BASE_URL}/#person`,
          },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [],
          },
        }
      : null;

  // Professional Service Schema
  const professionalServiceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#service`,
    name: "Ali Hatem - Frontend Development Services",
    description:
      "Professional frontend development services specializing in React.js, Next.js, and modern web technologies.",
    provider: {
      "@id": `${BASE_URL}/#person`,
    },
    areaServed: "Worldwide",
    serviceType: [
      "Web Development",
      "Frontend Development",
      "React Development",
      "Next.js Development",
      "UI/UX Implementation",
    ],
    url: BASE_URL,
  };

  // BreadcrumbList Schema
  const getBreadcrumbData = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
    ];

    let currentPath = BASE_URL;
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      breadcrumbs.push({
        "@type": "ListItem",
        position: index + 2,
        name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
        item: currentPath,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link
        rel="alternate"
        hrefLang="ar"
        href={url.replace(BASE_URL, `${BASE_URL}/ar`)}
      />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Ali Hatem Portfolio" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta
        property="og:locale"
        content={language === "ar" ? "ar_EG" : "en_US"}
      />
      <meta
        property="og:locale:alternate"
        content={language === "ar" ? "en_US" : "ar_EG"}
      />

      {/* Article specific OG tags */}
      {article && (
        <>
          <meta property="article:author" content="Ali Hatem" />
          <meta
            property="article:published_time"
            content={article.publishedAt}
          />
          <meta property="article:modified_time" content={article.modifiedAt} />
          {article.tags?.map((tag, index) => (
            <meta property="article:tag" content={tag} key={index} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@alihatem360" />
      <meta name="twitter:creator" content="@alihatem360" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional Meta */}
      <meta name="author" content="Ali Hatem Ramadan" />
      <meta name="creator" content="Ali Hatem" />
      <meta name="publisher" content="Ali Hatem" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbData())}
      </script>
      {projectStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(projectStructuredData)}
        </script>
      )}
      {collectionStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(collectionStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
