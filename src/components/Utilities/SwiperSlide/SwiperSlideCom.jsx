import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper.css";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper";
import PojectItem from "../../projects/components/projectItem";
import { useTranslation } from "react-i18next";
import { getVisibleProjectsForLanguage } from "../../../data/mergeProjects";
import {
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaKeyboard,
  FaMousePointer,
} from "react-icons/fa";

const EnhancedProjectSwiper = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);

  // Content is bundled at build time, so the list is derived during render
  // (and therefore present in the prerendered HTML).
  // Featured projects (a CMS flag) lead; without any, every visible one shows.
  const projectsData = useMemo(() => {
    const visibleProjects = getVisibleProjectsForLanguage(i18n.language);
    const featured = visibleProjects.filter((project) => project.featured);
    return featured.length ? featured : visibleProjects;
  }, [i18n.language]);

  const toggleAutoPlay = useCallback(() => {
    if (!swiperInstance || !swiperInstance.autoplay) return;

    if (isAutoPlay) {
      swiperInstance.autoplay.stop();
      setIsAutoPlay(false);
    } else {
      swiperInstance.autoplay.start();
      setIsAutoPlay(true);
    }
    setHasUserInteracted(true);
  }, [swiperInstance, isAutoPlay]);

  // Keyboard navigation
  const handleKeyPress = useCallback(
    (e) => {
      if (!swiperInstance) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          swiperInstance.slidePrev();
          setHasUserInteracted(true);
          break;
        case "ArrowRight":
          e.preventDefault();
          swiperInstance.slideNext();
          setHasUserInteracted(true);
          break;
        case " ":
          e.preventDefault();
          toggleAutoPlay();
          break;
        default:
          break;
      }
    },
    [swiperInstance, toggleAutoPlay],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Pause autoplay on user interaction
  useEffect(() => {
    if (hasUserInteracted && swiperInstance && swiperInstance.autoplay) {
      const timer = setTimeout(() => {
        if (isAutoPlay) {
          swiperInstance.autoplay.start();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasUserInteracted, swiperInstance, isAutoPlay]);

  const handleSlideChange = useCallback((swiper) => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  const handleSwiperInit = useCallback(
    (swiper) => {
      setSwiperInstance(swiper);
      // Ensure autoplay is properly initialized
      if (swiper.autoplay && isAutoPlay) {
        swiper.autoplay.start();
      }
    },
    [isAutoPlay],
  );

  const handlePrevSlide = useCallback(() => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
      setHasUserInteracted(true);
    }
  }, [swiperInstance]);

  const handleNextSlide = useCallback(() => {
    if (swiperInstance) {
      swiperInstance.slideNext();
      setHasUserInteracted(true);
    }
  }, [swiperInstance]);

  const handleMouseEnter = useCallback(() => {
    if (swiperInstance && swiperInstance.autoplay && isAutoPlay) {
      swiperInstance.autoplay.stop();
    }
  }, [swiperInstance, isAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (swiperInstance && swiperInstance.autoplay && isAutoPlay) {
      swiperInstance.autoplay.start();
    }
  }, [swiperInstance, isAutoPlay]);

  if (!projectsData || projectsData.length === 0) {
    return (
      <div className="no-projects">
        <h3>No projects available</h3>
        <p>Check back later for amazing projects!</p>
      </div>
    );
  }

  return (
    <div className="enhanced-swiper-container">
      {/* Header Section */}
      <div className="swiper-header">
        <div className="header-content">
          <h2 className="section-title">
            {t("slider.featuredProjects")}
            <span className="title-highlight">✨</span>
          </h2>
          <p className="section-subtitle">{t("slider.subtitle")}</p>
          <div className="slide-counter">
            <span className="current-slide">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span className="slide-separator">/</span>
            <span className="total-slides">
              {String(projectsData.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-group">
          <button
            className={`control-btn play-pause ${
              isAutoPlay ? "playing" : "paused"
            }`}
            onClick={toggleAutoPlay}
            aria-label={
              isAutoPlay
                ? t("slider.pauseSlideshow")
                : t("slider.playSlideshow")
            }
          >
            {isAutoPlay ? <FaPause /> : <FaPlay />}
          </button>

          <div className="navigation-controls">
            <button
              className="control-btn nav-btn prev"
              onClick={handlePrevSlide}
              aria-label={t("slider.previousSlide")}
            >
              <FaChevronLeft />
            </button>
            <button
              className="control-btn nav-btn next"
              onClick={handleNextSlide}
              aria-label={t("slider.nextSlide")}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="interaction-hints">
          <span className="hint">
            <FaKeyboard /> {t("slider.useArrowKeys")}
          </span>
          <span className="hint">
            <FaMousePointer /> {t("slider.hoverToPause")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="swiper-progress">
        <div
          className="progress-fill"
          style={{
            width: `${((currentSlide + 1) / projectsData.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Main Swiper */}
      <div
        className="swiper-wrapper-enhanced"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Swiper
          key={i18n.language}
          ref={swiperRef}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView="auto"
          spaceBetween={30}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true,
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet" data-slide="${index}"></span>`;
            },
          }}
          navigation={{
            prevEl: ".custom-prev",
            nextEl: ".custom-next",
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="enhanced-swiper"
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiperInit}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
              coverflowEffect: {
                rotate: 10,
                depth: 150,
              },
            },
            768: {
              slidesPerView: 1.5,
              spaceBetween: 25,
              coverflowEffect: {
                rotate: 12,
                depth: 180,
              },
            },
            1024: {
              slidesPerView: "auto",
              spaceBetween: 30,
              coverflowEffect: {
                rotate: 15,
                depth: 200,
              },
            },
          }}
        >
          {projectsData.map((project, index) => (
            <SwiperSlide key={project.id || index} className="enhanced-slide">
              <div className="slide-content">
                <PojectItem project={project} placement="home_carousel" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="custom-navigation">
          <button
            className="custom-prev nav-arrow"
            aria-label="Previous project"
          >
            <FaChevronLeft />
          </button>
          <button className="custom-next nav-arrow" aria-label="Next project">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Custom Pagination */}
      <div className="pagination-container">
        <div className="custom-pagination"></div>
      </div>

      {/* Background Effects */}
      <div className="background-effects">
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                "--delay": `${i * 0.5}s`,
                "--duration": `${15 + i * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProjectSwiper;
