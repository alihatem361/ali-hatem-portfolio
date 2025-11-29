import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper.css";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper";
import PojectItem from "../../projects/components/projectItem";
import LoaderCom from "../LoaderCom";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProjectData } from "../../../store/reducers/projectSlice";
import { useTranslation } from "react-i18next";
import GetAllData from "../../../data/projects";
const OurTeamCom = () => {
  const { getProjects, getSocials, getAboutme } = GetAllData();
  const [projectsDta, setProjectsData] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getProjects().then((data) => {
      setTimeout(() => {
        setProjectsData(data[0]);
      }, 1000);
    });
  }, [i18n.language]);

  return (
    <div className="container">
      {projectsDta !== undefined &&
      projectsDta !== null &&
      projectsDta.length > 0 ? (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          autoplay={{
            delay: 300000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="swiper_container"
        >
          {projectsDta?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <PojectItem project={item} />
              </SwiperSlide>
            );
          })}

          {/* Navigation Arrows */}
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
        </Swiper>
      ) : (
        <LoaderCom />
      )}
    </div>
  );
};

export default OurTeamCom;
