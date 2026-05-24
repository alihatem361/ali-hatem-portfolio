"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaFileDownload } from "react-icons/fa";
import { handleDownloadCv } from "../../helpers/index.js";
import PreviewCvModal from "../Auth/PreviewCvModal";
import SocialMedia from "../SocialMedia/index";

const CV_FILE_PATH = "/abdulrahman_mobileDeveloper13.pdf";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const HeaderBio = ({ aboutmeData }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const getRole = () => {
    if (aboutmeData?.title) {
      const parts = aboutmeData.title.split("|");
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
    return isArabic ? "مطور تطبيقات الجوال" : "Mobile Developer";
  };

  const getShortBio = () => {
    if (!aboutmeData?.bio) return [];
    if (Array.isArray(aboutmeData.bio)) return aboutmeData.bio.slice(0, 2);
    // Sanity returns a plain string — split on newlines, keep first 2 non-empty lines
    return aboutmeData.bio.split(/\n+/).filter(Boolean).slice(0, 2);
  };

  return (
    <motion.div
      className="header-text"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        {/* Available for hire badge */}
        <motion.div variants={itemVariants} className="hero-available-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          <span>{isArabic ? "متاح للعمل" : "Available for hire"}</span>
        </motion.div>

        {/* Greeting */}
        <motion.h4 variants={itemVariants}>
          {isArabic ? "مرحبا 👋" : "Hi there 👋"}
        </motion.h4>

        {/* Name */}
        <motion.h2 variants={itemVariants}>
          {isArabic ? "أنا " : "I'm "}
          <span className="hero-name-highlight">{aboutmeData.name}</span>
        </motion.h2>

        {/* Role / title line */}
        <motion.p variants={itemVariants} className="hero-role-line">
          <span className="hero-role-accent" aria-hidden="true">
            &lt;
          </span>
          <span className="hero-role-text">{getRole()}</span>
          <span className="hero-role-accent" aria-hidden="true">
            /&gt;
          </span>
        </motion.p>

        {/* Short bio */}
        <motion.p variants={itemVariants} className="bio-text">
          {getShortBio().map((item, index) => (
            <span key={index}>
              {item}
              <br />
            </span>
          ))}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="header-buttons d-flex justify-content-start gap-3"
        >
          <button
            className="btn cv-action-btn cv-download-btn"
            onClick={() =>
              handleDownloadCv(
                aboutmeData?.cv || CV_FILE_PATH,
                "Abdulrahman_Hatem_Resume",
              )
            }
          >
            <FaFileDownload className="cv-btn-icon" />
            <span>{isArabic ? "تحميل السيرة الذاتية" : "Download CV"}</span>
          </button>
          <PreviewCvModal
            label={isArabic ? "معاينة السيرة الذاتية" : "Preview CV"}
            cvUrl={aboutmeData?.cv || CV_FILE_PATH}
          />
        </motion.div>
      </div>

      {/* Social links */}
      <motion.div variants={itemVariants} className="header-social">
        <p className="hero-social-label">
          {isArabic ? "تواصل معي" : "Find me on"}
        </p>
        <SocialMedia />
      </motion.div>
    </motion.div>
  );
};

export default HeaderBio;
