import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCardButtons from "./ProjectCardButtons";
import YoutubeVideo from "./YoutubeVideo";
import LoomVideo from "./LoomVideo";
import "./ProjectDetailsModal.css";

// Icons
import { IoClose, IoRocket, IoCodeSlash, IoPlay } from "react-icons/io5";
import { FaGithub, FaExternalLinkAlt, FaLock, FaStar } from "react-icons/fa";
import { PiShootingStarBold } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { BiLinkExternal } from "react-icons/bi";

const ProjectDetailsModal = ({ show, project, handleClose }) => {
  const { i18n, t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  if (!show) return null;

  const hasVideo = project.videoKey || project.loomVideo;

  const modalContent = (
    <AnimatePresence>
      {show && (
        <motion.div
          className="project-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="project-details-modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="modal-close-btn"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <IoClose />
            </button>

            {/* Hero Section */}
            <div className="modal-hero">
              <div className="hero-background">
                <div className="hero-gradient-overlay"></div>
                <div className="hero-pattern"></div>
                {project.image && (
                  <img
                    src={project.image}
                    alt=""
                    className="hero-bg-image"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>

              <div className="hero-content">
                <motion.div
                  className="hero-badge"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <HiSparkles className="badge-icon" />
                  <span>Featured Project</span>
                </motion.div>

                <motion.h1
                  className="hero-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {project.title}
                </motion.h1>

                {project.category && (
                  <motion.span
                    className="hero-category"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.category}
                  </motion.span>
                )}

                {/* Quick Actions */}
                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-btn primary"
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.github && project.codeStatus !== "PRIVATE" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-btn secondary"
                    >
                      <FaGithub />
                      <span>View Code</span>
                    </a>
                  )}
                  {project.codeStatus === "PRIVATE" && (
                    <span className="hero-btn private">
                      <FaLock />
                      <span>
                        {i18n.language === "en"
                          ? "Private Repository"
                          : "مستودع خاص"}
                      </span>
                    </span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Main Content */}
            <div className="modal-content">
              <div className="content-grid">
                {/* Left Column - Media & Description */}
                <div className="content-main">
                  {/* Media Section */}
                  <motion.section
                    className="media-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="section-header">
                      <div className="section-icon">
                        <IoPlay />
                      </div>
                      <h2>Project Preview</h2>
                    </div>

                    <div className="media-container">
                      {project.loomVideo ? (
                        <LoomVideo videoUrl={project.loomVideo} />
                      ) : project.videoKey ? (
                        <YoutubeVideo project={project} />
                      ) : (
                        <div className="image-showcase">
                          <LazyLoadImage
                            src={project.image}
                            alt={project.title}
                            effect="blur"
                            className="showcase-image"
                            placeholderSrc={project.image}
                          />
                          <div className="image-shine"></div>
                        </div>
                      )}
                    </div>
                  </motion.section>

                  {/* Description Section */}
                  <motion.section
                    className="description-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="section-header">
                      <div className="section-icon">
                        <IoRocket />
                      </div>
                      <h2>
                        {i18n.language === "en"
                          ? "About This Project"
                          : "عن المشروع"}
                      </h2>
                    </div>

                    <div className="description-card">
                      <div className="description-accent"></div>
                      <p className="description-text">
                        {project.description ||
                          "No description available for this project."}
                      </p>
                    </div>
                  </motion.section>
                </div>

                {/* Right Column - Tech Stack & Info */}
                <div className="content-sidebar">
                  {/* Tech Stack Section */}
                  <motion.section
                    className="tech-section"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="section-header">
                      <div className="section-icon">
                        <IoCodeSlash />
                      </div>
                      <h2>
                        {i18n.language === "en" ? "Tech Stack" : "التقنيات"}
                      </h2>
                    </div>

                    <div className="tech-grid">
                      {project.technology?.map((tech, index) => (
                        <motion.div
                          key={index}
                          className="tech-item"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <span className="tech-dot"></span>
                          <span className="tech-name">{tech}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Project Stats */}
                  <motion.section
                    className="stats-section"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="section-header">
                      <div className="section-icon">
                        <PiShootingStarBold />
                      </div>
                      <h2>
                        {i18n.language === "en"
                          ? "Project Info"
                          : "معلومات المشروع"}
                      </h2>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">
                          {i18n.language === "en" ? "Status" : "الحالة"}
                        </span>
                        <span className="stat-value live">
                          <span className="status-dot"></span>
                          {i18n.language === "en" ? "Live" : "مباشر"}
                        </span>
                      </div>

                      <div className="stat-item">
                        <span className="stat-label">
                          {i18n.language === "en" ? "Technologies" : "التقنيات"}
                        </span>
                        <span className="stat-value">
                          {project.technology?.length || 0}
                        </span>
                      </div>

                      <div className="stat-item">
                        <span className="stat-label">
                          {i18n.language === "en" ? "Code Access" : "الكود"}
                        </span>
                        <span
                          className={`stat-value ${
                            project.codeStatus === "PRIVATE"
                              ? "private"
                              : "public"
                          }`}
                        >
                          {project.codeStatus === "PRIVATE" ? (
                            <>
                              <FaLock className="lock-icon" />
                              {i18n.language === "en" ? "Private" : "خاص"}
                            </>
                          ) : (
                            <>{i18n.language === "en" ? "Public" : "عام"}</>
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.section>

                  {/* Action Buttons */}
                  <motion.section
                    className="actions-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="actions-container">
                      <ProjectCardButtons project={project} noVideo={true} />
                    </div>
                  </motion.section>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="modal-decorations">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-line line-1"></div>
              <div className="decoration-line line-2"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ProjectDetailsModal;
