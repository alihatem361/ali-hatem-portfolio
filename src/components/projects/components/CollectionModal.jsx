import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaLayerGroup, FaExternalLinkAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { createSlug } from "../../../helpers";
import "./CollectionModal.css";

const CollectionModal = ({ show, collection, handleClose }) => {
  const { t, i18n } = useTranslation();

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

  if (!show || !collection) return null;

  const modalContent = (
    <AnimatePresence>
      {show && (
        <motion.div
          className="collection-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="collection-modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="collection-modal-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <IoClose />
            </button>

            {/* Header */}
            <div className="collection-modal-header">
              <div className="collection-header-icon">
                <FaLayerGroup />
              </div>
              <div className="collection-header-content">
                <motion.div
                  className="collection-badge"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <HiSparkles className="badge-icon" />
                  <span>{t("Collection")}</span>
                </motion.div>
                <h2 className="collection-title">{collection.title}</h2>
                <p className="collection-subtitle">
                  {collection.subProjects?.length}{" "}
                  {t("Projects in this collection")}
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="collection-projects-grid">
              {collection.subProjects?.map((project, index) => (
                <motion.div
                  key={index}
                  className="collection-project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <div className="collection-project-image">
                    <LazyLoadImage
                      src={project.image}
                      alt={project.title}
                      effect="blur"
                    />
                    <div className="collection-project-overlay">
                      <Link
                        to={`/project/${createSlug(project.title)}`}
                        className="view-project-btn"
                        onClick={handleClose}
                      >
                        {t("View Details")}
                      </Link>
                    </div>
                  </div>
                  <div className="collection-project-info">
                    <h4 className="collection-project-title">
                      {project.title}
                    </h4>
                    <div className="collection-project-tech">
                      {project.technology?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="collection-project-actions">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="demo-link"
                        >
                          <FaExternalLinkAlt />
                          <span>{t("Live Demo")}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CollectionModal;
