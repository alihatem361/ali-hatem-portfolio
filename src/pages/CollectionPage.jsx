import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { createSlug } from "../helpers";
import ProjectsApi from "../data/projects.json";
import ProjectsApiAR from "../data/projectsAR.json";
import "./CollectionPage.css";

// Icons
import { IoArrowBack, IoChevronForward, IoChevronBack } from "react-icons/io5";
import { FaLayerGroup, FaExternalLinkAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BiCopy, BiCheck } from "react-icons/bi";

const BASE_URL = "https://ali-hatem-portfolio.vercel.app";

// Collection definitions (should match projects/index.jsx)
const COLLECTIONS_CONFIG = {
  "teachers-collection": {
    titles: [
      "Mr Mohamed",
      "Mr Abdullah",
      "Mr Ahmed",
      "Alshaatir Academy",
      "Hadafik Altaelimia",
    ],
    name: { en: "Teachers' Websites", ar: "مواقع المعلمين" },
    description: {
      en: "A collection of personal websites for teachers showcasing their professional profiles, achievements, and contact information. Each website features bilingual support (Arabic/English) and dark/light mode.",
      ar: "مجموعة من المواقع الشخصية للمعلمين تعرض ملفاتهم المهنية وإنجازاتهم ومعلومات التواصل. كل موقع يدعم اللغتين العربية والإنجليزية والوضع الليلي والنهاري.",
    },
  },
  "mps-collection": {
    titles: [
      "mohammed-al-huwaila",
      "thamer-al-suwait",
      "saoud-al-asfour",
      "abdullah-mutlaq-awad-al-mutairi",
    ],
    name: { en: "MPs & Candidates Websites", ar: "مواقع المرشحين والنواب" },
    description: {
      en: "A collection of personal websites for MPs and political candidates, designed to showcase their portfolios, achievements, and contact information for their constituents.",
      ar: "مجموعة من المواقع الشخصية للنواب والمرشحين السياسيين، مصممة لعرض ملفاتهم وإنجازاتهم ومعلومات التواصل لناخبيهم.",
    },
  },
  "e3mel-landing-collection": {
    titles: ["Saudi National Day", "EBU Certificate", "shahadat alhadaf"],
    name: {
      en: "E3melbusiness Landing Pages",
      ar: "صفحات E3melbusiness الترويجية",
    },
    description: {
      en: "A collection of promotional landing pages and certificates designed for E3melbusiness organization, featuring special events, training certificates, and educational resources.",
      ar: "مجموعة من الصفحات الترويجية والشهادات المصممة لمؤسسة E3melbusiness، تتضمن الفعاليات الخاصة وشهادات التدريب والموارد التعليمية.",
    },
  },
};

const CollectionPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [subProjects, setSubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const isArabic = i18n.language === "ar";

  // Helper function to get proper image path
  const getImagePath = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  };

  useEffect(() => {
    const config = COLLECTIONS_CONFIG[collectionId];

    if (!config) {
      setLoading(false);
      return;
    }

    const allProjects =
      i18n.language === "en" ? ProjectsApi.Projects : ProjectsApiAR.Projects;

    // Find projects that belong to this collection
    const projectsInCollection = allProjects.filter((proj) =>
      config.titles.some(
        (title) => title.toLowerCase() === proj.title?.toLowerCase(),
      ),
    );

    // Build collection object
    const collectionData = {
      id: collectionId,
      title: config.name[i18n.language] || config.name.en,
      description: config.description[i18n.language] || config.description.en,
      image: projectsInCollection[0]?.image,
      technology: [
        ...new Set(projectsInCollection.flatMap((p) => p.technology || [])),
      ],
      projectCount: projectsInCollection.length,
    };

    setCollection(collectionData);
    setSubProjects(projectsInCollection);
    setLoading(false);
  }, [collectionId, i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="cp-loading">
        <div className="cp-loader">
          <div className="cp-loader-ring"></div>
          <FaLayerGroup className="cp-loader-icon" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="cp-not-found">
        <SEO
          title={
            isArabic
              ? "المجموعة غير موجودة | علي حاتم"
              : "Collection Not Found | Ali Hatem"
          }
          description={
            isArabic
              ? "عذراً، لم نتمكن من العثور على هذه المجموعة"
              : "Sorry, we couldn't find the collection you're looking for"
          }
          noindex={true}
          language={i18n.language}
        />
        <motion.div
          className="cp-not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="cp-404">404</span>
          <h1>{isArabic ? "المجموعة غير موجودة" : "Collection Not Found"}</h1>
          <p>
            {isArabic
              ? "عذراً، لم نتمكن من العثور على هذه المجموعة."
              : "Sorry, we couldn't find the collection you're looking for."}
          </p>
          <Link to="/projects" className="cp-back-home">
            <IoArrowBack />
            <span>{isArabic ? "العودة إلى المشاريع" : "Back to Projects"}</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <SEO
        title={`${collection.title} | Ali Hatem Portfolio`}
        description={collection.description}
        ogImage={
          collection.image ? `${BASE_URL}/${collection.image}` : undefined
        }
        ogType="collection"
        keywords={`${collection.title}, ${collection.technology?.join(", ") || ""}, Ali Hatem, Portfolio Collection`}
        language={i18n.language}
      />
      {/* Hero Section */}
      <section className="cp-hero-section">
        {/* Hero Background */}
        <div className="cp-hero-background">
          <div className="cp-hero-images-grid">
            {subProjects.slice(0, 4).map((proj, idx) => (
              <div key={idx} className="cp-hero-bg-image-wrapper">
                <img
                  src={getImagePath(proj.image)}
                  alt=""
                  className="cp-hero-bg-image"
                />
              </div>
            ))}
          </div>
          <div className="cp-hero-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="cp-hero-content">
          <div className="cp-hero-top-bar">
            <button onClick={() => navigate(-1)} className="cp-back-btn">
              {isArabic ? <IoChevronForward /> : <IoChevronBack />}
              <span>{isArabic ? "رجوع" : "Back"}</span>
            </button>

            <button onClick={handleCopyLink} className="cp-share-btn">
              {copied ? <BiCheck /> : <BiCopy />}
              <span>
                {copied
                  ? isArabic
                    ? "تم!"
                    : "Copied!"
                  : isArabic
                    ? "شارك"
                    : "Share"}
              </span>
            </button>
          </div>

          <div className="cp-hero-info">
            <motion.div
              className="cp-hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FaLayerGroup />
              <span>
                {isArabic ? "مجموعة" : "Collection"} • {collection.projectCount}{" "}
                {isArabic ? "مشاريع" : "Projects"}
              </span>
            </motion.div>

            <motion.h1
              className="cp-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {collection.title}
            </motion.h1>

            <motion.p
              className="cp-hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {collection.description}
            </motion.p>

            <motion.div
              className="cp-hero-tech"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {collection.technology?.slice(0, 6).map((tech, index) => (
                <span key={index} className="cp-tech-tag">
                  {tech}
                </span>
              ))}
              {collection.technology?.length > 6 && (
                <span className="cp-tech-tag cp-tech-more">
                  +{collection.technology.length - 6}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="cp-projects-section">
        <div className="cp-section-header">
          <h2>
            <HiSparkles className="cp-section-icon" />
            {isArabic
              ? "المشاريع في هذه المجموعة"
              : "Projects in this Collection"}
          </h2>
        </div>

        <div className="cp-projects-grid">
          {subProjects.map((project, index) => (
            <motion.div
              key={index}
              className="cp-project-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="cp-project-image">
                <LazyLoadImage
                  src={getImagePath(project.image)}
                  alt={project.title}
                  effect="blur"
                  wrapperClassName="cp-image-wrapper"
                />
                <div className="cp-project-image-overlay">
                  <Link
                    to={`/project/${createSlug(project.title)}`}
                    className="cp-view-btn"
                  >
                    {isArabic ? "عرض التفاصيل" : "View Details"}
                  </Link>
                </div>
              </div>

              <div className="cp-project-content">
                <Link
                  to={`/project/${createSlug(project.title)}`}
                  className="cp-project-title-link"
                >
                  <h3 className="cp-project-title">{project.title}</h3>
                </Link>

                <p className="cp-project-description">
                  {project.description?.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description}
                </p>

                <div className="cp-project-tech">
                  {project.technology?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="cp-mini-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="cp-project-actions">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cp-demo-btn"
                    >
                      <FaExternalLinkAlt />
                      <span>{isArabic ? "عرض مباشر" : "Live Demo"}</span>
                    </a>
                  )}
                  <Link
                    to={`/project/${createSlug(project.title)}`}
                    className="cp-details-btn"
                  >
                    {isArabic ? "التفاصيل" : "Details"}
                    {isArabic ? <IoChevronBack /> : <IoChevronForward />}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back to Projects Link */}
      <section className="cp-footer-section">
        <Link to="/projects" className="cp-all-projects-link">
          <IoArrowBack />
          <span>{isArabic ? "عرض جميع المشاريع" : "View All Projects"}</span>
        </Link>
      </section>
    </div>
  );
};

export default CollectionPage;
