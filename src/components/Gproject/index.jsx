import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaGithub,
  FaGlobe,
  FaPlay,
  FaImage,
  FaLock,
  FaExternalLinkAlt,
  FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import "./style.css";

function Gproject({ gproject }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!gproject) return null;

  const { title, video, description, github, demo, codeStatus, technology } =
    gproject;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -3,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const renderButton = (link, text, icon, isPrimary = false) => {
    if (!link) return null;
    const isDisabled = text === "GitHub" && codeStatus === "PRIVATE";

    return (
      <motion.a
        className={`gproject-btn ${isPrimary ? "gproject-btn-primary" : "gproject-btn-secondary"} ${isDisabled ? "disabled" : ""}`}
        href={isDisabled ? undefined : link}
        target="_blank"
        rel="noreferrer"
        variants={buttonVariants}
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap={!isDisabled ? "tap" : undefined}
      >
        {icon}
        <span>{text}</span>
        {isDisabled && <FaLock className="lock-icon" />}
      </motion.a>
    );
  };

  return (
    <motion.div
      className="gproject-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Decorations */}
      <div className="gproject-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
      </div>

      <div className="gproject-card">
        {/* Header Section */}
        <motion.div className="gproject-header" variants={itemVariants}>
          <div className="featured-badge">
            <HiSparkles className="sparkle-icon" />
            <span>Featured Project</span>
          </div>
          <h3 className="gproject-title">
            <span className="title-text">{title || "Project Title"}</span>
            <motion.div
              className="rocket-icon"
              animate={
                isHovered ? { rotate: 45, scale: 1.2 } : { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              <FaRocket />
            </motion.div>
          </h3>
        </motion.div>

        {/* Main Content Grid */}
        <div className="gproject-content">
          {/* Media Section */}
          <motion.div className="gproject-media" variants={itemVariants}>
            {video ? (
              <div className="video-wrapper">
                <div className="video-glow"></div>
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(video)}?rel=0&modestbranding=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={title || "Project Video"}
                />
                <div className="video-overlay">
                  <FaPlay className="play-icon" />
                </div>
              </div>
            ) : (
              <motion.div
                className="image-wrapper"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="image-glow"></div>
                {!imageLoaded && !imageError && (
                  <div className="image-loader">
                    <div className="loader-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                )}
                <img
                  src={
                    gproject.image ||
                    gproject.imeg ||
                    "https://via.placeholder.com/600x400/1a1a1a/d4af37?text=Project"
                  }
                  alt={title || "Project Image"}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                {imageError && (
                  <div className="image-error">
                    <FaImage />
                    <span>Image not available</span>
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="image-hover-overlay">
                  <FaExternalLinkAlt />
                  <span>View Project</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div className="gproject-info" variants={itemVariants}>
            <div className="info-content">
              <p className="gproject-description">
                {description || "No description available"}
              </p>

              {/* Tech Stack */}
              {technology && technology.length > 0 && (
                <div className="tech-stack">
                  <span className="tech-label">Built with:</span>
                  <div className="tech-tags">
                    {technology.slice(0, 5).map((tech, index) => (
                      <motion.span
                        key={index}
                        className="tech-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {technology.length > 5 && (
                      <span className="tech-tag tech-more">
                        +{technology.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="gproject-buttons">
              {renderButton(demo, "Live Demo", <FaGlobe />, true)}
              {renderButton(github, "Source Code", <FaGithub />)}
              {renderButton(video, "Watch Video", <FaPlay />)}
            </div>
          </motion.div>
        </div>

        {/* Decorative Corner */}
        <div className="corner-decoration top-left"></div>
        <div className="corner-decoration top-right"></div>
        <div className="corner-decoration bottom-left"></div>
        <div className="corner-decoration bottom-right"></div>
      </div>
    </motion.div>
  );
}

export default Gproject;
