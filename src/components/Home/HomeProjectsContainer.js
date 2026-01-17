import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import GetAllData from "../../data/projects";

// components
import GProject from "../Gproject/index";
import SwiperSlideCom from "../Utilities/SwiperSlide/SwiperSlideCom";
import FloatingWhatsAppCom from "../WhatsappChat/FloatingWhatsAppCom";
import SkillComponent from "../Skills/index";
import LowerCurve from "../Utilities/LowerCurve";
const HomeProjectsContainer = () => {
  const { t, i18n } = useTranslation();
  const [projectsDta, setProjectsData] = useState([]);
  const { getProjects } = GetAllData();

  useEffect(() => {
    getProjects().then((data) => {
      // console.log(" : ======", data[0]);
      setProjectsData(data[0].slice(0, 3));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <React.Fragment>
      <div className="projects-container ">
        <FloatingWhatsAppCom />
        <div className="container">
          <SkillComponent />
          <SwiperSlideCom />
          <div className="text-center ">
            <Link to="/projects" className="btn button1">
              {t("projects.homebutton")}
              <i
                class="fa-solid fa-arrow-right"
                style={{
                  transform:
                    i18n.language === "ar" ? "rotate(180deg)" : "rotate(0deg)",
                  padding: "0 5px",
                }}
              ></i>
            </Link>
          </div>
        </div>
        <GProject gproject={projectsDta[0]} />

        <LowerCurve />
      </div>
    </React.Fragment>
  );
};

export default HomeProjectsContainer;
