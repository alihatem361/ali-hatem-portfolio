"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
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
      setProjectsData(data[0].slice(0, 3));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <React.Fragment>
      <div className="projects-container">
        <FloatingWhatsAppCom />

        {/* Skills strip */}
        <div className="container">
          <SkillComponent />
        </div>

        {/* Featured projects carousel */}
        <section className="home-swiper-section">
          <div className="container">
            <div className="home-section-header" data-aos="fade-up">
              <span className="home-section-tag">
                {i18n.language === "ar" ? "أعمالي" : "My Work"}
              </span>
              <h2 className="home-section-title">
                {i18n.language === "ar" ? "مشاريع مميزة" : "Featured Projects"}
              </h2>
              <p className="home-section-sub">
                {i18n.language === "ar"
                  ? "نماذج من أبرز مشاريعي المنشورة"
                  : "A selection of published apps & projects"}
              </p>
            </div>
            <SwiperSlideCom />
            <div className="text-center home-cta-wrap">
              <Link href="/projects" className="btn button1">
                {t("projects.homebutton")}
                <i
                  className="fa-solid fa-arrow-right"
                  style={{
                    transform:
                      i18n.language === "ar"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    padding: "0 5px",
                  }}
                ></i>
              </Link>
            </div>
          </div>
        </section>

        <GProject gproject={projectsDta[0]} />

        <LowerCurve />
      </div>
    </React.Fragment>
  );
};

export default HomeProjectsContainer;
