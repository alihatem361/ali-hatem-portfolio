import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaLink,
  FaGooglePlay,
  FaGithub,
  FaDownload,
  FaCalendarAlt,
  FaFolder,
  FaCheckCircle,
} from "react-icons/fa";
import { BiGlobe } from "react-icons/bi";
import GetAllData from "../data/projects";
import Footer from "../components/footer";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { getProjects } = GetAllData();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    getProjects().then((data) => {
      const foundProject = data[0].find(
        (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
      );
      setProject(foundProject);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, i18n.language]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(project?.title || "");
    const links = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    };
    window.open(links[platform], "_blank");
  };

  const getVideoId = () => {
    if (project?.videoKey) return project.videoKey;
    if (project?.video) {
      const match = project.video.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\n?#]+)/
      );
      return match ? match[1] : null;
    }
    return null;
  };

  // Parse features from description
  const parseFeatures = (description) => {
    if (!description) return [];
    const features = [];
    const lines = description.split("\\n").filter((line) => line.trim());
    lines.forEach((line) => {
      if (line.startsWith("-") || line.startsWith("•")) {
        features.push(line.replace(/^[-•]\s*/, "").trim());
      }
    });
    return features;
  };

  if (loading) {
    return (
      <div className="project-detail-loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project Not Found</h2>
        <button onClick={() => navigate("/projects")} className="back-btn">
          {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{isRTL ? "الرجوع" : "Go Back"}</span>
        </button>
      </div>
    );
  }

  const videoId = getVideoId();
  const features = parseFeatures(project.description);
  const isGooglePlayLink = project.demo?.includes("play.google.com");
  const isApkDownload = project.demo?.includes(".apk");

  // Get clean description (first paragraph without bullet points)
  const getCleanDescription = () => {
    if (!project.description) return "";
    const lines = project.description.split("\\n");
    const introLines = lines.filter(
      (line) =>
        !line.startsWith("-") &&
        !line.startsWith("•") &&
        !line.startsWith("⭐") &&
        line.trim()
    );
    return introLines.slice(0, 3).join(" ").trim();
  };

  // Get the correct image URL (handle both local paths and full URLs)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) return imagePath;
    // If it's a local path, prepend the public folder path
    return `${process.env.PUBLIC_URL}/${imagePath}`;
  };

  return (
    <div className="project-detail-page">
      {/* ===== SECTION 1: CINEMATIC HERO ===== */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img
          src={getImageUrl(project.imeg)}
          alt={project.title}
          className="hero-image"
          loading="eager"
        />
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
        <div className="hero-content">
          <h1 className="hero-title" data-aos="fade-right">
            {project.title}
          </h1>
          <div
            className="tech-badges"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            {project.technology?.slice(0, 5).map((tech, index) => (
              <span key={index} className="tech-badge">
                {tech}
              </span>
            ))}
            {project.technology?.length > 6 && (
              <span className="tech-badge tech-badge-more">
                +{project.technology.length - 6}
              </span>
            )}
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* ===== SECTION 2: STORY/BLOG LAYOUT ===== */}
      <section className="story-section">
        <div className="story-container">
          {/* Sticky Sidebar */}
          <aside className="story-sidebar">
            <div className="sidebar-content">
              <div className="sidebar-item">
                <FaCalendarAlt className="sidebar-icon" />
                <div>
                  <span className="sidebar-label">
                    {isRTL ? "التاريخ" : "Date"}
                  </span>
                  <span className="sidebar-value">2024</span>
                </div>
              </div>
              <div className="sidebar-item">
                <FaFolder className="sidebar-icon" />
                <div>
                  <span className="sidebar-label">
                    {isRTL ? "النوع" : "Type"}
                  </span>
                  <span className="sidebar-value">
                    {project.codeStatus === "PRIVATE"
                      ? isRTL
                        ? "عمل خاص"
                        : "Client Work"
                      : isRTL
                      ? "مفتوح المصدر"
                      : "Open Source"}
                  </span>
                </div>
              </div>

              <div className="share-section">
                <span className="share-label">
                  {isRTL ? "شارك المشروع" : "Share Project"}
                </span>
                <div className="share-buttons">
                  <button
                    className="share-btn linkedin"
                    onClick={() => handleShare("linkedin")}
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin />
                  </button>
                  <button
                    className="share-btn twitter"
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter />
                  </button>
                  <button
                    className={`share-btn copy ${copied ? "copied" : ""}`}
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                  >
                    <FaLink />
                    {copied && (
                      <span className="copied-tooltip">
                        {isRTL ? "تم النسخ!" : "Copied!"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="story-main">
            <div className="story-intro" data-aos="fade-up">
              <h2>{isRTL ? "نظرة عامة" : "Overview"}</h2>
              <p className="intro-text">
                {getCleanDescription() || project.description}
              </p>
            </div>

            {features.length > 0 && (
              <div className="story-features" data-aos="fade-up">
                <h2>{isRTL ? "المميزات الرئيسية" : "Key Features"}</h2>
                <ul className="features-list">
                  {features.slice(0, 8).map((feature, index) => (
                    <li key={index} className="feature-item">
                      <FaCheckCircle className="feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="story-tech" data-aos="fade-up">
              <h2>{isRTL ? "التقنيات المستخدمة" : "Technologies Used"}</h2>
              <div className="tech-grid">
                {project.technology?.map((tech, index) => (
                  <div key={index} className="tech-item">
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== SECTION 3: VIDEO SHOWCASE ===== */}
      {videoId && (
        <section className="video-section">
          <div className="video-container">
            <h2 className="section-title" data-aos="fade-up">
              {isRTL ? "شاهد التطبيق" : "See It In Action"}
            </h2>
            <div className="video-wrapper" data-aos="zoom-in">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0`}
                title="Project Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 4: MOBILE MOCKUPS GALLERY ===== */}
      {project.images && project.images.length > 0 && (
        <section className="gallery-section">
          <div className="gallery-container">
            <h2 className="section-title" data-aos="fade-up">
              {isRTL ? "معرض الشاشات" : "Screen Gallery"}
            </h2>
            <div className="mockups-grid">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="phone-mockup"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="phone-frame">
                    <div className="phone-notch"></div>
                    <LazyLoadImage
                      src={image}
                      alt={`Screen ${index + 1}`}
                      effect="blur"
                      className="mockup-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 5: CTA FOOTER ===== */}
      <section className="cta-section">
        <div className="cta-container" data-aos="fade-up">
          <h2 className="cta-title">
            {isRTL ? "هل أعجبك المشروع؟" : "Like what you see?"}
          </h2>
          <p className="cta-subtitle">
            {isRTL
              ? "جرب التطبيق الآن أو تواصل معي لمشروعك القادم"
              : "Try the app now or contact me for your next project"}
          </p>
          <div className="cta-buttons">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="cta-btn primary"
              >
                {isGooglePlayLink ? (
                  <>
                    <FaGooglePlay />
                    <span>Google Play</span>
                  </>
                ) : isApkDownload ? (
                  <>
                    <FaDownload />
                    <span>Download APK</span>
                  </>
                ) : (
                  <>
                    <BiGlobe />
                    <span>Live Demo</span>
                  </>
                )}
              </a>
            )}
            {project.github && project.codeStatus !== "PRIVATE" && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="cta-btn secondary"
              >
                <FaGithub />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
