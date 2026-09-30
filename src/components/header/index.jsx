import "./style.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
// components
import GetAllData from "../../data/projects.jsx";
import HeaderImage from "./HeaderImage";
import HeaderBio from "./HeaderBio";

const Header = () => {
  const { i18n } = useTranslation();
  const { getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);

  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [i18n.language]);

  const scrollToNextSection = () => {
    const next = document.getElementById("skills");
    if (!next) return;
    const top = next.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="hero-section" id="home" aria-label="Introduction">
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeaderBio aboutmeData={aboutmeData} />
        <HeaderImage aboutmeData={aboutmeData} />
      </motion.div>

      {/* Scroll Indicator — actionable, not just decorative */}
      <motion.button
        type="button"
        className="scroll-indicator"
        onClick={scrollToNextSection}
        aria-label={
          i18n.language === "ar"
            ? "التمرير إلى قسم المهارات"
            : "Scroll to skills section"
        }
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="scroll-arrows">
          <span></span>
          <span></span>
        </div>
      </motion.button>
    </section>
  );
};

export default Header;
