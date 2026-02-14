import React from "react";
import "./Styles.css";
import {
  FaHtml5,
  FaCss3,
  FaReact,
  FaBootstrap,
  FaGithub,
  FaNodeJs,
  FaSass,
} from "react-icons/fa";
import { TbBrandJavascript, TbBrandRedux, TbBrandNextjs } from "react-icons/tb";
import { SiTailwindcss } from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { SiMui } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const SkillsComponent = () => {
  const { t } = useTranslation();
  const skills = [
    {
      icon: FaReact,
      name: "React",
      color: "#61DAFB",
      category: "Frontend",
    },
    {
      icon: TbBrandNextjs,
      name: "Next.js",
      color: "#000000",
      category: "Frontend",
    },
    {
      icon: TbBrandRedux,
      name: "Redux",
      color: "#764ABC",
      category: "Frontend",
    },
    {
      icon: TbBrandJavascript,
      name: "JavaScript",
      color: "#F7DF1E",
      category: "Programming",
    },
    {
      icon: SiTypescript,
      name: "TypeScript",
      color: "#3178C6",
      category: "Programming",
    },
    {
      icon: FaNodeJs,
      name: "Node.js",
      color: "#339933",
      category: "Backend",
    },
    {
      icon: DiMongodb,
      name: "MongoDB",
      color: "#47A248",
      category: "Database",
    },
    {
      icon: IoLogoFirebase,
      name: "Firebase",
      color: "#FFCA28",
      category: "Backend",
    },
    {
      icon: SiMui,
      name: "Material UI",
      color: "#0081CB",
      category: "UI Framework",
    },
    {
      icon: FaHtml5,
      name: "HTML5",
      color: "#E34F26",
      category: "Markup",
    },
    {
      icon: FaCss3,
      name: "CSS3",
      color: "#1572B6",
      category: "Styling",
    },
    {
      icon: FaSass,
      name: "SASS",
      color: "#CC6699",
      category: "Styling",
    },
    {
      icon: FaBootstrap,
      name: "Bootstrap",
      color: "#7952B3",
      category: "UI Framework",
    },
    {
      icon: SiTailwindcss,
      name: "Tailwind CSS",
      color: "#06B6D4",
      category: "UI Framework",
    },
    {
      icon: FaGithub,
      name: "GitHub",
      color: "#181717",
      category: "Tools",
    },
  ];
  return (
    <section className="skills-container" id="skills" data-aos="fade-up">
      <div className="skills-header">
        <h2>{t("skills.title")}</h2>
        <p className="skills-subtitle">{t("skills.subtitle")}</p>
        <div className="skills-divider"></div>
      </div>

      <div className="skills-content">
        <div className="skills-carousel">
          <div className="skills-track">
            {[...skills, ...skills].map((skill, index) => {
              return (
                <div
                  className="skill-card"
                  key={index}
                  style={{ "--skill-color": skill.color }}
                >
                  <div className="skill-icon-wrapper">
                    <skill.icon className="skill-icon" />
                    <div className="skill-glow"></div>
                  </div>
                  <div className="skill-info">
                    <h3 className="skill-name">{skill.name}</h3>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <div className="skill-hover-effect"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsComponent;
