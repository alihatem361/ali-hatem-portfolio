import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import GetAllData from "../../data/projects";
import "./HomeProjectsContainer.css";

// components
import GProject from "../Gproject/index";
import SwiperSlideCom from "../Utilities/SwiperSlide/SwiperSlideCom";
import FloatingWhatsAppCom from "../WhatsappChat/FloatingWhatsAppCom";
import SkillComponent from "../Skills/index";
import WorkExperience from "../WorkExperience/index";
import Certifications from "../Certifications/index";
const HomeProjectsContainer = () => {
  const { t, i18n } = useTranslation();
  const [projectsDta, setProjectsData] = useState([]);
  const { getProjects, getSocials, getAboutme } = GetAllData();

  useEffect(() => {
    getProjects().then((data) => {
      // console.log(" : ======", data[0]);
      setProjectsData(data[0].slice(0, 3));
    });
  }, [i18n.language]);

  return (
    <React.Fragment>
      <div className="projects-container ">
        <SwiperSlideCom />
        {/* send the index of the project */}
        <GProject gproject={projectsDta[1]} />
        <FloatingWhatsAppCom />
        <div className="container">
          <SkillComponent />
          <WorkExperience />
          <Certifications />
          <div className="projects-cta">
            <Link to="/projects" className="btn button1">
              <span>{t("projects.homebutton")}</span>
              <FaArrowRight
                aria-hidden="true"
                className="projects-cta__arrow"
                style={{
                  transform:
                    i18n.language === "ar" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeProjectsContainer;
