import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay, Keyboard } from "swiper";
import { getImagePath } from "../helpers";
import "./MobileProjectDetails.css";

import {
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
  IoExpandOutline,
  IoClose,
  IoPlay,
  IoPause,
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

/** Tracks the user's reduced-motion preference, reacting to changes. */
const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(query.matches);
    const onChange = (event) => setPrefers(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return prefers;
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
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gallery =
    project.gallery?.length > 0 ? project.gallery : [project.image];
  const features = project.features || [];
  const heroPhones = gallery.slice(0, 3);

  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const shotLabel = (index) =>
    isArabic
      ? `لقطة ${index + 1} من ${gallery.length}`
      : `Screenshot ${index + 1} of ${gallery.length}`;

  const goToSlide = (index) => {
    if (!swiper || swiper.destroyed) return;
    // slideToLoop maps a real index onto the duplicated slide set when
    // looping; it falls back to slideTo behaviour when loop is off.
    swiper.slideToLoop(index);
  };

  const toggleAutoplay = () => {
    if (!swiper?.autoplay) return;
    if (isPlaying) {
      swiper.autoplay.stop();
      setIsPlaying(false);
    } else {
      swiper.autoplay.start();
      setIsPlaying(true);
    }
  };

  // --- Lightbox -------------------------------------------------------
  const openLightbox = (index) => {
    lastFocusedRef.current = document.activeElement;
    setLightboxIndex(index);
    swiper?.autoplay?.stop();
    setIsPlaying(false);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    // Return focus to the thumbnail the user came from.
    lastFocusedRef.current?.focus?.();
  }, []);

  const stepLightbox = useCallback(
    (delta) =>
      setLightboxIndex((current) =>
        current === null
          ? current
          : (current + delta + gallery.length) % gallery.length,
      ),
    [gallery.length],
  );

  const isLightboxOpen = lightboxIndex !== null;

  // Keyboard control and scroll lock while the viewer is open.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key === "ArrowRight") stepLightbox(isArabic ? -1 : 1);
      if (event.key === "ArrowLeft") stepLightbox(isArabic ? 1 : -1);
      if (event.key === "Tab") {
        // Simple focus trap: the dialog's own controls are the only stops.
        const focusables = lightboxRef.current?.querySelectorAll("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog so keys reach it immediately.
    requestAnimationFrame(() => lightboxRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, stepLightbox, isArabic]);

  // Keep the carousel in step with the viewer when it closes.
  useEffect(() => {
    if (lightboxIndex !== null) goToSlide(lightboxIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

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

        <p className="mpd-gallery-hint">
          {isArabic
            ? "اضغط على أي لقطة لعرضها بالحجم الكامل"
            : "Tap any screenshot to view it full size"}
        </p>

        <div className="mpd-gallery-swiper-wrap">
          {/* Fractional slidesPerView with centeredSlides keeps the active
              screenshot genuinely centred and the neighbours peeking evenly on
              both sides. Depth is a plain CSS scale on the active slide — no
              3D effect, so nothing has to be re-measured per frame and the
              gallery renders once, not five times over. */}
          <Swiper
            key={isArabic ? "ar" : "en"}
            dir={isArabic ? "rtl" : "ltr"}
            grabCursor={true}
            centeredSlides={true}
            loop={gallery.length > 3}
            slidesPerView={1.35}
            spaceBetween={16}
            breakpoints={{
              560: { slidesPerView: 2.1, spaceBetween: 20 },
              900: { slidesPerView: 3, spaceBetween: 24 },
              1200: { slidesPerView: 3.4, spaceBetween: 28 },
            }}
            speed={600}
            watchSlidesProgress={true}
            /* The gallery mounts before the responsive breakpoint and the
               lazy-loaded screenshots have settled, so Swiper's first
               measurement is stale and it centres the wrong slide. These make
               it re-measure whenever the size actually changes. */
            observer={true}
            observeParents={true}
            resizeObserver={true}
            keyboard={{ enabled: true }}
            autoplay={
              prefersReducedMotion
                ? false
                : {
                    delay: 3800,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
            }
            navigation={{
              prevEl: ".mpd-gallery-prev",
              nextEl: ".mpd-gallery-next",
            }}
            modules={[Navigation, Autoplay, Keyboard]}
            className="mpd-gallery-swiper"
            onSwiper={(instance) => {
              setSwiper(instance);
              // One forced re-measure after layout settles, so the first
              // painted frame is already correctly centred.
              requestAnimationFrame(() => {
                if (instance.destroyed) return;
                instance.update();
                instance.slideToLoop(0, 0, false);
              });
            }}
            onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
            onAutoplayStart={() => setIsPlaying(true)}
            onAutoplayStop={() => setIsPlaying(false)}
          >
            {gallery.map((src, index) => (
              <SwiperSlide key={index} className="mpd-gallery-slide">
                <button
                  type="button"
                  className="mpd-shot"
                  onClick={() => openLightbox(index)}
                  aria-label={
                    isArabic
                      ? `عرض ${shotLabel(index)} بالحجم الكامل`
                      : `View ${shotLabel(index)} full size`
                  }
                  // Only the centred screenshot is reachable by Tab; the
                  // rest are decorative until swiped into view.
                  tabIndex={index === activeIndex ? 0 : -1}
                >
                  <PhoneMockup
                    src={src}
                    alt={`${project.title} — ${shotLabel(index)}`}
                    size="gallery"
                  />
                  <span className="mpd-shot-zoom" aria-hidden="true">
                    <IoExpandOutline />
                  </span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className="mpd-gallery-nav mpd-gallery-prev"
            aria-label={isArabic ? "اللقطة السابقة" : "Previous screenshot"}
          >
            {isArabic ? (
              <IoChevronForwardCircleOutline />
            ) : (
              <IoChevronBackCircleOutline />
            )}
          </button>
          <button
            type="button"
            className="mpd-gallery-nav mpd-gallery-next"
            aria-label={isArabic ? "اللقطة التالية" : "Next screenshot"}
          >
            {isArabic ? (
              <IoChevronBackCircleOutline />
            ) : (
              <IoChevronForwardCircleOutline />
            )}
          </button>
        </div>

        {/* Thumbnail rail — direct access to any screenshot, which the
            prev/next-only carousel could not offer. */}
        <div
          className="mpd-thumbs"
          role="tablist"
          aria-label={isArabic ? "لقطات التطبيق" : "App screenshots"}
        >
          {gallery.map((src, index) => (
            <button
              type="button"
              key={index}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={shotLabel(index)}
              className={`mpd-thumb ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => goToSlide(index)}
            >
              <img src={getImagePath(src)} alt="" loading="lazy" />
            </button>
          ))}
        </div>

        <div className="mpd-gallery-controls">
          <span className="mpd-gallery-counter" aria-live="polite">
            <strong>{activeIndex + 1}</strong>
            <span>/</span>
            <span>{gallery.length}</span>
          </span>
          {!prefersReducedMotion && (
            <button
              type="button"
              className="mpd-gallery-playpause"
              onClick={toggleAutoplay}
              aria-label={
                isPlaying
                  ? isArabic
                    ? "إيقاف العرض التلقائي"
                    : "Pause slideshow"
                  : isArabic
                    ? "تشغيل العرض التلقائي"
                    : "Play slideshow"
              }
            >
              {isPlaying ? <IoPause /> : <IoPlay />}
            </button>
          )}
        </div>
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

      {/* Full-size screenshot viewer */}
      {isLightboxOpen && (
        <div
          className="mpd-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={isArabic ? "عارض اللقطات" : "Screenshot viewer"}
          ref={lightboxRef}
          tabIndex={-1}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="mpd-lightbox-close"
            onClick={closeLightbox}
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <IoClose />
          </button>

          {gallery.length > 1 && (
            <button
              type="button"
              className="mpd-lightbox-nav mpd-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                stepLightbox(-1);
              }}
              aria-label={isArabic ? "السابق" : "Previous"}
            >
              {isArabic ? <IoChevronForward /> : <IoChevronBack />}
            </button>
          )}

          {/* Stop propagation so clicking the image itself does not close. */}
          <figure
            className="mpd-lightbox-figure"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getImagePath(gallery[lightboxIndex])}
              alt={`${project.title} — ${shotLabel(lightboxIndex)}`}
            />
            <figcaption>{shotLabel(lightboxIndex)}</figcaption>
          </figure>

          {gallery.length > 1 && (
            <button
              type="button"
              className="mpd-lightbox-nav mpd-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                stepLightbox(1);
              }}
              aria-label={isArabic ? "التالي" : "Next"}
            >
              {isArabic ? <IoChevronBack /> : <IoChevronForward />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileProjectDetails;
