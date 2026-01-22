import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SocialMedia from "../SocialMedia/index";
import CV from "../../assets/Ali_Hatem_Ramadan_Resume.pdf";
import { handleDownloadCv } from "../../helpers/index";
import PreviewCvModal from "../Auth/PreviewCvModal";
import { FaFileDownload, FaEnvelope } from "react-icons/fa";

// Typewriter effect component
const TypewriterText = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delay = 2000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, speed, deleteSpeed, delay]);

  return (
    <span className="typewriter-text">
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

const HeaderBio = ({ aboutmeData }) => {
  const { t, i18n } = useTranslation();

  const roles =
    i18n.language === "en"
      ? [
          "Front-End Developer",
          "React Specialist",
          "UI/UX Enthusiast",
          "Problem Solver",
        ]
      : [
          "مطور واجهات أمامية",
          "متخصص React",
          "مهتم بتجربة المستخدم",
          "حلال مشاكل",
        ];

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

      {/* Typewriter Role */}
      <motion.div className="hero-role" variants={itemVariants}>
        <span className="role-prefix">{i18n.language === "en" ? "A" : ""}</span>
        <TypewriterText
          texts={roles}
          speed={80}
          deleteSpeed={40}
          delay={2500}
        />
      </motion.div>

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
        <motion.button
          className="btn-primary-gradient"
          onClick={() => handleDownloadCv(CV, "Ali_Hatem_Ramadan_Resume")}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span>{i18n.language === "en" ? "Download CV" : "تحميل السيرة"}</span>
          <FaFileDownload className="btn-icon" />
        </motion.button>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <PreviewCvModal />
        </motion.div>
      </motion.div>

      {/* Social Media */}
      <motion.div className="hero-social" variants={itemVariants}>
        <span className="social-label">
          {i18n.language === "en" ? "Connect with me" : "تواصل معي"}
        </span>
        <div className="social-divider"></div>
        <SocialMedia />
      </motion.div>
    </div>
  );
};

export default HeaderBio;
