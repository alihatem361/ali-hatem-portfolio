"use client";

import "../Utilities/style.css";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
// components
import GetAllData from "../../data/projects.js";
import LowerCurve from "../Utilities/LowerCurve";
import HeaderImage from "./HeaderImage";
import HeaderBio from "./HeaderBio";

const Header = () => {
  const { i18n } = useTranslation();
  const { getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);

  const fetchAboutMe = useCallback(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [getAboutme]);

  useEffect(() => {
    fetchAboutMe();
  }, [i18n.language, fetchAboutMe]);

  return (
    <div className="position-relative hero-section-wrapper">
      {/* Decorative background elements */}
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-bg-glow hero-bg-glow--left" aria-hidden="true" />
      <div className="hero-bg-glow hero-bg-glow--right" aria-hidden="true" />

      <div className="header">
        <HeaderBio aboutmeData={aboutmeData} />
        <HeaderImage aboutmeData={aboutmeData} />
      </div>

      {/* Scroll down indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span className="hero-scroll-label">scroll</span>
      </motion.div>

      <LowerCurve />
    </div>
  );
};

export default Header;
