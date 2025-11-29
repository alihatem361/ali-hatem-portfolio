import React from "react";
import { motion } from "framer-motion";
import "./Styles.css";
import { FaGithub, FaAndroid, FaApple } from "react-icons/fa";
import {
  SiDart,
  SiFlutter,
  SiFigma,
  SiGoogleplay,
  SiAppstore,
  SiVisualstudiocode,
} from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";
import { TbApi } from "react-icons/tb";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const SkillsComponent = () => {
  const skills = [
    {
      icon: SiFlutter,
      name: "Flutter",
      color: "#02569B",
    },
    {
      icon: SiDart,
      name: "Dart",
      color: "#0175C2",
    },
    {
      icon: IoLogoFirebase,
      name: "Firebase",
      color: "#FFCA28",
    },
    {
      icon: FaAndroid,
      name: "Android",
      color: "#3DDC84",
    },
    {
      icon: FaApple,
      name: "iOS",
      color: "#A2AAAD",
    },
    {
      icon: SiGoogleplay,
      name: "Google Play",
      color: "#ffc107",
    },
    {
      icon: SiAppstore,
      name: "App Store",
      color: "#0D96F6",
    },
    {
      icon: SiFigma,
      name: "Figma",
      color: "#F24E1E",
    },
    {
      icon: TbApi,
      name: "RESTful APIs",
      color: "#ffc107",
    },
    {
      icon: SiVisualstudiocode,
      name: "VS Code",
      color: "#007ACC",
    },
    {
      icon: FaGithub,
      name: "Github",
      color: "#fff",
    },
  ];

  return (
    <motion.div
      className="skills-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="skills-header" variants={headerVariants}>
        <h2>Skills</h2>
        <p>My technical level</p>
      </motion.div>
      <div className="skills">
        <div className="skills-track">
          {[...skills, ...skills].map((skill, index) => {
            return (
              <motion.div
                className="iconbox"
                key={index}
                variants={index < skills.length ? itemVariants : {}}
                whileHover={{
                  scale: 1.15,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className="skill-icon"
                  style={{ "--skill-color": skill.color }}
                >
                  <skill.icon />
                </div>
                <p>{skill.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsComponent;
