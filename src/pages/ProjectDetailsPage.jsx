import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import YoutubeVideo from "../components/projects/components/YoutubeVideo";
import LoomVideo from "../components/projects/components/LoomVideo";
import SEO from "../components/SEO";
import HireMe from "../components/HireMe";
import CaseStudy from "../components/projects/components/CaseStudy";
import MobileProjectDetails from "./MobileProjectDetails";
import {
  createSlug,
  getProjectSlug,
  getImagePath,
  getAbsoluteImageUrl,
  sanityImage,
  SITE_URL,
} from "../helpers";
import { track } from "../helpers/analytics";
import { getProjectsForLanguage } from "../data/mergeProjects";
import "./ProjectDetailsPage.css";

// Icons
import {
  IoArrowBack,
  IoGlobeOutline,
  IoChevronForward,
  IoChevronBack,
} from "react-icons/io5";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaLock,
  FaYoutube,
  FaPlay,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BiCopy, BiCheck } from "react-icons/bi";

const BASE_URL = SITE_URL;

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Resolved during render, not in an effect, so the prerendered HTML already
  // carries this project's <title>, description and og:image.
  const project = useMemo(() => {
    const allProjects = getProjectsForLanguage(i18n.language);

    // Match the canonical slug first. The title-derived fallback keeps any
    // previously shared Arabic URL working, since those were built from the
    // translated title before projects carried an explicit slug.
    return (
      allProjects.find((proj) => getProjectSlug(proj) === slug) ||
      allProjects.find((proj) => createSlug(proj.title) === slug) ||
      null
    );
  }, [slug, i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Once per slug — a language switch re-renders but is not a new view.
  // Reported by slug because GA's page titles differ per language.
  useEffect(() => {
    if (project) {
      track("project_view", {
        project_slug: getProjectSlug(project),
        project_type: project.type === "mobile" ? "mobile" : "web",
        collection_id: project.collectionId || "none",
      });
    } else {
      track("project_not_found", { requested_slug: slug });
    }
  }, [slug]);

  /** onClick for outbound demo/code/video links. */
  const trackLink = (linkType, placement) => () =>
    track("project_link_click", {
      link_type: linkType,
      project_slug: project ? getProjectSlug(project) : slug,
      placement,
    });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isArabic = i18n.language === "ar";

  if (!project) {
    return (
      <div className="pdp-not-found">
        <SEO
          title={
            isArabic
              ? "المشروع غير موجود | علي حاتم"
              : "Project Not Found | Ali Hatem"
          }
          description={
            isArabic
              ? "عذراً، لم نتمكن من العثور على هذا المشروع"
              : "Sorry, we couldn't find the project you're looking for"
          }
          noindex={true}
          language={i18n.language}
        />
        <motion.div
          className="pdp-not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="pdp-404">404</span>
          <h1>{isArabic ? "المشروع غير موجود" : "Project Not Found"}</h1>
          <p>
            {isArabic
              ? "عذراً، لم نتمكن من العثور على هذا المشروع."
              : "Sorry, we couldn't find the project you're looking for."}
          </p>
          <Link to="/projects" className="pdp-back-home">
            <IoArrowBack />
            <span>{isArabic ? "العودة إلى المشاريع" : "Back to Projects"}</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const hasVideo = project.loomVideo || project.videoKey;

  // Generate SEO-friendly project description
  const seoDescription = project.description
    ? `${project.title} - ${project.description.substring(0, 150)}${project.description.length > 150 ? "..." : ""}`
    : `${project.title} - A project by Ali Hatem built with ${project.technology?.slice(0, 3).join(", ") || "modern technologies"}`;

  const seoElement = (
    <SEO
      title={`${project.title} | Ali Hatem Portfolio`}
      description={seoDescription}
      ogImage={getAbsoluteImageUrl(project.image)}
      ogType="article"
      project={{
        title: project.title,
        description: project.description,
        image: project.image,
        technology: project.technology,
        demo: project.demo,
      }}
      keywords={`${project.title}, ${project.technology?.join(", ") || ""}, Ali Hatem, Portfolio Project`}
      language={i18n.language}
    />
  );

  if (project.type === "mobile") {
    return (
      <>
        {seoElement}
        <MobileProjectDetails
          project={project}
          isArabic={isArabic}
          onLinkClick={trackLink}
        />
        <HireMe placement="case_study" />
      </>
    );
  }

  return (
    <div className="project-details-page">
      {seoElement}
      {/* Hero Section with Image */}
      <section className="pdp-hero-section">
        {/* Hero Image/Video Background */}
        <div className="pdp-hero-media">
          {project.loomVideo ? (
            <div className="pdp-hero-video">
              <LoomVideo videoUrl={project.loomVideo} />
            </div>
          ) : project.videoKey ? (
            <div className="pdp-hero-video">
              <YoutubeVideo project={project} />
            </div>
          ) : (
            <div className="pdp-hero-image-container">
              <LazyLoadImage
                src={sanityImage(getImagePath(project.image), { width: 1600 })}
                alt={project.title}
                className="pdp-hero-image"
                effect="blur"
                wrapperClassName="pdp-hero-image-wrapper"
              />
              <div className="pdp-hero-image-overlay"></div>
            </div>
          )}
        </div>

        {/* Hero Content Overlay */}
        <div className="pdp-hero-content">
          <div className="pdp-hero-top-bar">
            <button onClick={() => navigate(-1)} className="pdp-back-btn">
              {isArabic ? <IoChevronForward /> : <IoChevronBack />}
              <span>{isArabic ? "رجوع" : "Back"}</span>
            </button>

            <button onClick={handleCopyLink} className="pdp-share-btn">
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

          <div className="pdp-hero-info">
            <motion.div
              className="pdp-hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <HiSparkles />
              <span>
                {project.caseStudy?.role ||
                  t(`projectDetails.type.${project.type === "mobile" ? "mobile" : "web"}`)}
              </span>
            </motion.div>

            <motion.h1
              className="pdp-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {project.title}
            </motion.h1>

            <motion.div
              className="pdp-hero-tech"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.technology?.slice(0, 4).map((tech, index) => (
                <span key={index} className="pdp-tech-tag">
                  {tech}
                </span>
              ))}
              {project.technology?.length > 4 && (
                <span className="pdp-tech-tag pdp-tech-more">
                  +{project.technology.length - 4}
                </span>
              )}
            </motion.div>

            <motion.div
              className="pdp-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdp-action-btn pdp-action-primary"
                  onClick={trackLink("demo", "detail_hero")}
                >
                  <IoGlobeOutline />
                  <span>{isArabic ? "معاينة مباشرة" : "Live Demo"}</span>
                </a>
              )}
              {project.github && project.codeStatus !== "PRIVATE" && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdp-action-btn pdp-action-secondary"
                  onClick={trackLink("github", "detail_hero")}
                >
                  <FaGithub />
                  <span>{isArabic ? "الكود" : "Code"}</span>
                </a>
              )}
              {project.codeStatus === "PRIVATE" && (
                <span className="pdp-action-btn pdp-action-private">
                  <FaLock />
                  <span>{isArabic ? "خاص" : "Private"}</span>
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="pdp-details-section">
        <div className="pdp-details-container">
          {/* Description */}
          <motion.div
            className="pdp-description-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="pdp-section-title">
              {isArabic ? "عن المشروع" : "About This Project"}
            </h2>
            <p className="pdp-description-text">
              {project.description ||
                (isArabic
                  ? "لا يوجد وصف متاح لهذا المشروع."
                  : "No description available for this project.")}
            </p>
          </motion.div>

          <CaseStudy caseStudy={project.caseStudy} />

          {/* Info Cards Row */}
          <motion.div
            className="pdp-info-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {/* Tech Stack */}
            <div className="pdp-info-card">
              <h3>{isArabic ? "التقنيات" : "Technologies"}</h3>
              <div className="pdp-tech-list">
                {project.technology?.map((tech, index) => (
                  <span key={index} className="pdp-tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="pdp-info-card">
              <h3>{isArabic ? "روابط" : "Links"}</h3>
              <div className="pdp-links-list">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdp-link-item"
                    onClick={trackLink("demo", "detail_links")}
                  >
                    <IoGlobeOutline />
                    <span>{isArabic ? "الموقع المباشر" : "Live Website"}</span>
                    <FaExternalLinkAlt className="pdp-link-arrow" />
                  </a>
                )}
                {project.github && project.codeStatus !== "PRIVATE" && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdp-link-item"
                    onClick={trackLink("github", "detail_links")}
                  >
                    <FaGithub />
                    <span>GitHub</span>
                    <FaExternalLinkAlt className="pdp-link-arrow" />
                  </a>
                )}
                {(project.videoKey || project.video) && (
                  <a
                    href={
                      project.video || `https://youtu.be/${project.videoKey}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdp-link-item"
                    onClick={trackLink("video", "detail_links")}
                  >
                    <FaYoutube />
                    <span>YouTube</span>
                    <FaExternalLinkAlt className="pdp-link-arrow" />
                  </a>
                )}
                {project.codeStatus === "PRIVATE" && (
                  <div className="pdp-link-item pdp-link-private">
                    <FaLock />
                    <span>
                      {isArabic ? "المستودع خاص" : "Private Repository"}
                    </span>
                  </div>
                )}
                {project.caseStudy?.codeNote && (
                  <p className="pdp-code-note">{project.caseStudy.codeNote}</p>
                )}
              </div>
            </div>

          </motion.div>

          {/* Back to Projects */}
          <motion.div
            className="pdp-footer-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/projects" className="pdp-all-projects-link">
              {isArabic ? <IoChevronForward /> : <IoChevronBack />}
              <span>{isArabic ? "جميع المشاريع" : "All Projects"}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <HireMe placement="case_study" />
    </div>
  );
};

export default ProjectDetailsPage;
