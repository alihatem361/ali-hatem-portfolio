import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper";
import { getImagePath } from "../helpers";
import "./MobileProjectDetails.css";

import {
  IoArrowBack,
  IoChevronForward,
  IoChevronBack,
  IoLogoApple,
  IoLogoAndroid,
  IoGlobeOutline,
  IoShieldCheckmarkOutline,
  IoCardOutline,
  IoConstructOutline,
  IoNotificationsOutline,
  IoChevronForwardCircleOutline,
  IoChevronBackCircleOutline,
} from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BiCopy, BiCheck } from "react-icons/bi";
import { SiIonic, SiReact, SiTypescript, SiCapacitor } from "react-icons/si";
import { GiBearFace } from "react-icons/gi";

const TECH_ICON_MAP = {
  "ionic react": SiIonic,
  react: SiReact,
  typescript: SiTypescript,
  capacitor: SiCapacitor,
  zustand: GiBearFace,
};

const FEATURE_ICON_MAP = {
  shield: IoShieldCheckmarkOutline,
  card: IoCardOutline,
  wrench: IoConstructOutline,
  bell: IoNotificationsOutline,
};

// Drives the gallery's depth effect off each slide's actual rendered
// position (not Swiper's internal translate/slidesGrid bookkeeping,
// which lags the real DOM by a full slide-step in this setup, nor
// the swiper-slide-active/prev/next classes, which land on the
// wrong slide for this centeredSlides + non-zero initialSlide
// configuration).
const applyDepthStyles = (swiperInstance) => {
  const containerRect = swiperInstance.el.getBoundingClientRect();
  const centerX = containerRect.left + containerRect.width / 2;
  const step = swiperInstance.slidesSizesGrid[0] || containerRect.width || 1;
  swiperInstance.slides.forEach((slideEl) => {
    const phone = slideEl.querySelector(".mpd-phone");
    if (!phone) return;
    const r = slideEl.getBoundingClientRect();
    const distPx = r.left + r.width / 2 - centerX;
    const dist = Math.min(Math.abs(distPx) / step, 2);
    const scale = Math.max(1 - dist * 0.22, 0.56);
    const opacity = Math.max(1 - dist * 0.55, 0.25);
    phone.style.transform = `scale(${scale}) rotate(var(--mpd-tilt))`;
    phone.style.opacity = opacity;
  });
};

const PhoneMockup = ({ src, alt, size = "md", tilt = 0, className = "" }) => (
  <div
    className={`mpd-phone mpd-phone-${size} ${className}`}
    style={{ "--mpd-tilt": `${tilt}deg` }}
  >
    <span className="mpd-phone-notch" />
    <span className="mpd-phone-btn mpd-phone-btn-power" />
    <span className="mpd-phone-btn mpd-phone-btn-vol-up" />
    <span className="mpd-phone-btn mpd-phone-btn-vol-down" />
    <div className="mpd-phone-screen">
      <LazyLoadImage
        src={getImagePath(src)}
        alt={alt}
        effect="blur"
        wrapperClassName="mpd-phone-image-wrapper"
      />
    </div>
  </div>
);

const MobileProjectDetails = ({ project, isArabic }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gallery =
    project.gallery?.length > 0 ? project.gallery : [project.image];
  const features = project.features || [];
  const heroPhones = gallery.slice(0, 3);

  // Swiper's native `loop` only appends slides on forward autoplay
  // ticks (never prepends), so the left-side buffer drains after a
  // few cycles and everything piles up on one side. Instead we
  // render several repeats of the gallery and silently rewind to
  // the middle set whenever we drift too close to either edge,
  // which gives a genuinely symmetric, endless carousel.
  const GALLERY_REPEATS = 5;
  const middleSetStart = Math.floor(GALLERY_REPEATS / 2) * gallery.length;
  const extendedGallery = Array.from({ length: GALLERY_REPEATS }, () => gallery).flat();

  return (
    <div className="mobile-project-details">
      {/* Top Bar */}
      <div className="mpd-top-bar">
        <button onClick={() => navigate(-1)} className="mpd-back-btn">
          {isArabic ? <IoChevronForward /> : <IoChevronBack />}
          <span>{isArabic ? "رجوع" : "Back"}</span>
        </button>
        <button onClick={handleCopyLink} className="mpd-share-btn">
          {copied ? <BiCheck /> : <BiCopy />}
          <span>
            {copied
              ? isArabic
                ? "تم!"
                : "Copied!"
              : isArabic
                ? "شارك"
                : "Share"}
          </span>
        </button>
      </div>

      {/* Hero */}
      <section className="mpd-hero">
        <div className="mpd-hero-glow mpd-hero-glow-1" />
        <div className="mpd-hero-glow mpd-hero-glow-2" />

        <div className="mpd-hero-inner">
          <div className="mpd-hero-copy">
            <motion.div
              className="mpd-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <HiSparkles />
              <span>
                {isArabic ? "تطبيق موبايل مميز" : "Mobile App Showcase"}
              </span>
            </motion.div>

            <motion.h1
              className="mpd-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {project.title}
            </motion.h1>

            {project.tagline && (
              <motion.p
                className="mpd-tagline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.tagline}
              </motion.p>
            )}

            <motion.div
              className="mpd-tech-badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {project.technology?.map((tech, index) => {
                const Icon = TECH_ICON_MAP[tech.toLowerCase()];
                return (
                  <span key={index} className="mpd-tech-badge">
                    {Icon && <Icon />}
                    <span>{tech}</span>
                  </span>
                );
              })}
            </motion.div>

            <motion.div
              className="mpd-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mpd-action-btn mpd-action-primary"
                >
                  <IoGlobeOutline />
                  <span>{isArabic ? "معاينة مباشرة" : "Live Demo"}</span>
                </a>
              )}
              {project.codeStatus === "PRIVATE" && (
                <span className="mpd-action-btn mpd-action-private">
                  <FaLock />
                  <span>{isArabic ? "كود خاص" : "Private Codebase"}</span>
                </span>
              )}
              {project.platform?.map((p, i) => (
                <span key={i} className="mpd-platform-chip">
                  {p.toLowerCase() === "ios" ? (
                    <IoLogoApple />
                  ) : (
                    <IoLogoAndroid />
                  )}
                  <span>{p}</span>
                </span>
              ))}
            </motion.div>
          </div>

          <div className="mpd-hero-phones">
            {heroPhones.map((src, index) => (
              <motion.div
                key={index}
                className={`mpd-hero-phone-slot mpd-hero-phone-slot-${index}`}
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  y: [0, -14, 0],
                  scale: 1,
                }}
                transition={{
                  opacity: { delay: 0.3 + index * 0.15, duration: 0.6 },
                  scale: { delay: 0.3 + index * 0.15, duration: 0.6 },
                  y: {
                    delay: 0.9 + index * 0.15,
                    duration: 4 + index * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <PhoneMockup
                  src={src}
                  alt={`${project.title} screenshot ${index + 1}`}
                  size={index === 1 ? "lg" : "sm"}
                  tilt={index === 0 ? -8 : index === 2 ? 8 : 0}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      {project.description && (
        <section className="mpd-about">
          <motion.div
            className="mpd-about-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mpd-section-title">
              {isArabic ? "عن التطبيق" : "About The App"}
            </h2>
            <p className="mpd-about-text">{project.description}</p>
          </motion.div>
        </section>
      )}

      {/* Bento Feature Grid */}
      {features.length > 0 && (
        <section className="mpd-features">
          <motion.h2
            className="mpd-section-title mpd-features-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            {isArabic ? "المزايا الأساسية" : "Core Features"}
          </motion.h2>

          <div className="mpd-bento">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICON_MAP[feature.icon];
              return (
                <motion.div
                  key={feature.key}
                  className={`mpd-bento-card mpd-bento-card-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mpd-bento-bg">
                    <LazyLoadImage
                      src={getImagePath(feature.image)}
                      alt={feature.title}
                      effect="blur"
                    />
                  </div>
                  <div className="mpd-bento-overlay" />
                  {index === 0 && (
                    <div className="mpd-bento-phone">
                      <PhoneMockup
                        src={feature.image}
                        alt={feature.title}
                        size="md"
                      />
                    </div>
                  )}
                  <div className="mpd-bento-content">
                    <span className="mpd-bento-icon">
                      {Icon && <Icon />}
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="mpd-gallery">
        <motion.h2
          className="mpd-section-title mpd-gallery-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          {isArabic ? "جولة داخل التطبيق" : "Inside The App"}
        </motion.h2>

        <div className="mpd-gallery-swiper-wrap">
          <div className="mpd-gallery-viewport">
            <Swiper
              key={isArabic ? "ar" : "en"}
              dir={isArabic ? "rtl" : "ltr"}
              grabCursor={true}
              centeredSlides={true}
              loop={false}
              initialSlide={middleSetStart}
              slidesPerView={1}
              spaceBetween={24}
              speed={700}
              autoplay={{
                delay: 2600,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                el: ".mpd-gallery-pagination",
                type: "fraction",
                formatFractionCurrent: (n) => ((n - 1) % gallery.length) + 1,
                formatFractionTotal: () => gallery.length,
              }}
              navigation={{
                prevEl: ".mpd-gallery-prev",
                nextEl: ".mpd-gallery-next",
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="mpd-gallery-swiper"
              onSwiper={(swiperInstance) => {
                requestAnimationFrame(() => {
                  if (swiperInstance.destroyed) return;
                  swiperInstance.slideTo(middleSetStart, 0, false);
                  applyDepthStyles(swiperInstance);
                });
              }}
              onProgress={applyDepthStyles}
              onSetTranslate={applyDepthStyles}
              onSlideChangeTransitionEnd={(swiperInstance) => {
                // Recycle back into the middle repetition once we
                // drift into an outer block, so the carousel can
                // keep scrolling forever without ever hitting a
                // real array boundary.
                const idx = swiperInstance.activeIndex;
                if (
                  idx < gallery.length ||
                  idx >= extendedGallery.length - gallery.length
                ) {
                  const target = middleSetStart + (idx % gallery.length);
                  swiperInstance.slideTo(target, 0, false);
                }
              }}
            >
              {extendedGallery.map((src, index) => (
                <SwiperSlide key={index} className="mpd-gallery-slide">
                  <PhoneMockup
                    src={src}
                    alt={`${project.title} screenshot ${(index % gallery.length) + 1}`}
                    size="gallery"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className="mpd-gallery-nav mpd-gallery-prev" aria-label="Previous screenshot">
            {isArabic ? <IoChevronForwardCircleOutline /> : <IoChevronBackCircleOutline />}
          </button>
          <button className="mpd-gallery-nav mpd-gallery-next" aria-label="Next screenshot">
            {isArabic ? <IoChevronBackCircleOutline /> : <IoChevronForwardCircleOutline />}
          </button>
        </div>

        <div className="mpd-gallery-pagination" />
      </section>

      {/* Footer CTA */}
      <motion.section
        className="mpd-footer-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mpd-footer-cta-inner">
          <h2>
            {isArabic
              ? "هل لديك فكرة تطبيق مشابه؟"
              : "Have a similar app idea?"}
          </h2>
          <p>
            {isArabic
              ? "لنحوّلها إلى تطبيق موبايل جاهز للانطلاق."
              : "Let's turn it into a launch-ready mobile app."}
          </p>
          <div className="mpd-footer-cta-actions">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="mpd-action-btn mpd-action-primary"
              >
                <IoGlobeOutline />
                <span>{isArabic ? "جرّب التطبيق" : "Try The Demo"}</span>
              </a>
            )}
            <Link to="/projects" className="mpd-all-projects-link">
              {isArabic ? <IoChevronForward /> : <IoChevronBack />}
              <span>{isArabic ? "جميع المشاريع" : "All Projects"}</span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MobileProjectDetails;
