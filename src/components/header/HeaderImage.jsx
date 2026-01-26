import React from "react";
import { motion } from "framer-motion";
import LoaderCom from "../Utilities/LoaderCom";

const HeaderImage = ({ aboutmeData }) => {
  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const glowAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      className="hero-image-container"
      variants={imageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Glow Effect Behind Image */}
      <motion.div className="image-glow" animate={glowAnimation} />

      {/* Decorative Rings */}
      <div className="decorative-ring ring-1"></div>
      <div className="decorative-ring ring-2"></div>
      <div className="decorative-ring ring-3"></div>

      {/* Main Image Wrapper with Float */}
      <motion.div className="image-wrapper" animate={floatAnimation}>
        {/* Blob Background */}
        <div className="blob-background">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="blobGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f7dc6f" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              fill="url(#blobGradient)"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,73.1,41.8C64.8,54.6,53.7,65.8,40.5,73.2C27.3,80.6,13.6,84.3,-0.8,85.7C-15.2,87.1,-30.4,86.3,-43.4,79.8C-56.4,73.4,-67.1,61.4,-74.5,47.7C-81.9,34,-86,18.5,-85.8,3.1C-85.6,-12.3,-81.2,-27.7,-73.3,-40.8C-65.4,-53.9,-54.1,-64.7,-41,-72.1C-27.9,-79.5,-14,-83.4,0.9,-85C15.8,-86.6,31.6,-85.8,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Profile Image */}
        <div className="profile-image-wrapper">
          {aboutmeData.headerImage ? (
            <motion.img
              src={aboutmeData.headerImage}
              alt="Ali Hatem - Frontend Developer"
              className="hero-profile-image"
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          ) : (
            <div className="image-placeholder">
              <LoaderCom />
            </div>
          )}
        </div>

        {/* Floating Tech Icons */}
        <motion.div
          className="floating-icon icon-react"
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 000-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 011.182-3.046 24.752 24.752 0 01-1.182-3.046zm12.675 7.305l-.133-.469a23.357 23.357 0 00-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 001.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 01-1.182 3.046z" />
          </svg>
        </motion.div>

        <motion.div
          className="floating-icon icon-js"
          animate={{
            y: [5, -5, 5],
            x: [-3, 3, -3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>JS</span>
        </motion.div>

        <motion.div
          className="floating-icon icon-css"
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>CSS</span>
        </motion.div>
      </motion.div>

      {/* Experience Badge */}
      <motion.div
        className="experience-badge"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
      >
        <span className="exp-number">2+</span>
        <span className="exp-text">
          Years
          <br />
          Experience
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HeaderImage;
