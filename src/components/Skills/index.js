import React from "react";
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

const SkillsComponent = () => {
  const skills = [
    {
      icon: SiFlutter,
      name: "Flutter",
    },
    {
      icon: SiDart,
      name: "Dart",
    },
    {
      icon: IoLogoFirebase,
      name: "Firebase",
    },
    {
      icon: FaAndroid,
      name: "Android",
    },
    {
      icon: FaApple,
      name: "iOS",
    },
    {
      icon: SiGoogleplay,
      name: "Google Play",
    },
    {
      icon: SiAppstore,
      name: "App Store",
    },
    {
      icon: SiFigma,
      name: "Figma",
    },
    {
      icon: TbApi,
      name: "RESTful APIs",
    },
    {
      icon: SiVisualstudiocode,
      name: "VS Code",
    },
    {
      icon: FaGithub,
      name: "Github",
    },
  ];
  return (
    <div className="skills-container" data-aos="fade-up">
      <div className="skills-header">
        <h2>Skills</h2>
        <p>My technical level</p>
      </div>
      <div className="skills">
        <div className="skills-track">
          {[...skills, ...skills].map((skill, index) => {
            return (
              <div className="iconbox" key={index}>
                <div className="skill-icon">
                  <skill.icon />
                </div>
                <p>{skill.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsComponent;
