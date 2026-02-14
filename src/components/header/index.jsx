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
    <section className="hero-section" id="home">
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
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

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
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
      </motion.div>
    </section>
  );
};

export default Header;
