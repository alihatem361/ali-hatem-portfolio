import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SocialMedia from "../SocialMedia/index";
import { FaFileDownload, FaArrowRight, FaEnvelope } from "react-icons/fa";
import { CV_FILES } from "../../data/cvTemplate";
import { track } from "../../helpers/analytics";

const HeaderBio = ({ aboutmeData }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="hero-content">
      {/* Greeting Badge */}
      <motion.div className="greeting-badge" variants={itemVariants}>
        <span className="badge-dot"></span>
        <span>
          {i18n.language === "en" ? "Available for work" : "متاح للعمل"}
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.div className="hero-heading" variants={itemVariants}>
        <span className="greeting-text">
          {i18n.language === "en" ? "Hello, I'm" : "مرحباً، أنا"}
        </span>
        <h1 className="hero-name">
          <span className="gradient-text">
            {aboutmeData.name || "Ali Hatem"}
          </span>
        </h1>
      </motion.div>

      {/* Role — static so the specialization is readable at a glance */}
      <motion.p className="hero-role" variants={itemVariants}>
        {t("hero.role")}
      </motion.p>

      {/* Bio Description */}
      <motion.div className="hero-description" variants={itemVariants}>
        {aboutmeData.bio && aboutmeData.bio.length > 0 ? (
          <p>{aboutmeData.bio[0]}</p>
        ) : (
          <p>
            {i18n.language === "en"
              ? "Crafting beautiful, responsive web experiences with modern technologies. Passionate about clean code and exceptional user interfaces."
              : "صناعة تجارب ويب جميلة ومتجاوبة باستخدام التقنيات الحديثة. شغوف بالكود النظيف وواجهات المستخدم الاستثنائية."}
          </p>
        )}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div className="hero-buttons" variants={itemVariants}>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/projects"
            className="btn-primary-gradient"
            onClick={() =>
              track("cta_click", { cta: "view_projects", placement: "hero" })
            }
          >
            <span>{t("hero.viewProjects")}</span>
            <FaArrowRight className="btn-icon btn-icon--directional" />
          </Link>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <a
            href={CV_FILES[lang]}
            download
            className="btn-hero-secondary"
            onClick={() =>
              track("cv_download", { cv_language: lang, placement: "hero" })
            }
          >
            <span>{t("cv.downloadButton")}</span>
            <FaFileDownload className="btn-icon" />
          </a>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <a
            href="#hire"
            className="btn-hero-secondary"
            onClick={() =>
              track("cta_click", { cta: "contact", placement: "hero" })
            }
          >
            <span>{t("hero.contact")}</span>
            <FaEnvelope className="btn-icon" />
          </a>
        </motion.div>
      </motion.div>

      {/* Social Media */}
      <motion.div className="hero-social" variants={itemVariants}>
        <span className="social-label">
          {i18n.language === "en" ? "Connect with me" : "تواصل معي"}
        </span>
        <div className="social-divider"></div>
        <SocialMedia placement="hero" />
      </motion.div>
    </div>
  );
};

export default HeaderBio;
