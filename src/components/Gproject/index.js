import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaGithub, FaPlay, FaDownload } from "react-icons/fa";
import { SiFlutter, SiDart, SiFirebase } from "react-icons/si";
import "./style.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Floating animation for tech stack icons
const floatingVariants = {
  animate: (custom) => ({
    y: [0, -15, 0],
    rotate: [0, custom.rotate, 0],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

function Gproject({ gproject }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for background
  // eslint-disable-next-line no-unused-vars
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!gproject) return null;

  const { title, video, description, github, demo, codeStatus } = gproject;

  const renderButton = (link, text, icon, buttonType = "default") => {
    if (!link) return null;

    const buttonClasses = {
      github: `gproject_btn gproject_btn_github ${
        codeStatus === "PRIVATE" ? "disabled" : ""
      }`,
      demo: "gproject_btn gproject_btn_demo",
      video: "gproject_btn gproject_btn_video",
      default: "gproject_btn",
    };

    return (
      <motion.a
        className={buttonClasses[buttonType] || buttonClasses.default}
        href={link}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonType === "video" ? (
          <span className="video_play_icon">{icon}</span>
        ) : (
          <>
            {icon}
            <span>{text}</span>
          </>
        )}
      </motion.a>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className="gproject_card_container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Green Glow Background */}
      <div className="gproject_glow_bg" />

      {/* Floating Tech Stack Icons */}
      <div className="floating_tech_icons">
        <motion.div
          className="floating_icon flutter_icon"
          variants={floatingVariants}
          animate="animate"
          custom={{ duration: 3, rotate: 5 }}
        >
          <SiFlutter />
        </motion.div>
        <motion.div
          className="floating_icon dart_icon"
          variants={floatingVariants}
          animate="animate"
          custom={{ duration: 3.5, rotate: -5 }}
        >
          <SiDart />
        </motion.div>
        <motion.div
          className="floating_icon firebase_icon"
          variants={floatingVariants}
          animate="animate"
          custom={{ duration: 4, rotate: 8 }}
        >
          <SiFirebase />
        </motion.div>
      </div>

      <motion.div className="gproject_card" variants={itemVariants}>
        <motion.h3 className="gproject_title" variants={itemVariants}>
          <FaRocket className="rocket-icon" />
          <span className="gradient_text">{title || ""}</span>
        </motion.h3>

        <div className="gproject_card_body">
          {video && (
            <motion.div
              className="gproject_phone_mockup"
              variants={itemVariants}
              whileHover={{ scale: 1.02, rotateY: 5 }}
            >
              {/* Phone Frame */}
              <div className="phone_frame">
                <div className="phone_notch"></div>
                <div className="phone_screen">
                  <iframe
                    src={`https://www.youtube.com/embed/${getVideoId(
                      video,
                    )}?autoplay=1&mute=1&loop=1&playlist=${getVideoId(video)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  />
                </div>
                <div className="phone_home_indicator"></div>
              </div>
            </motion.div>
          )}

          <motion.div className="gproject_card_content" variants={itemVariants}>
            <p>{description || "No description available"}</p>

            <motion.div className="gproject_buttons" variants={itemVariants}>
              {renderButton(github, "GitHub", <FaGithub />, "github")}
              {renderButton(demo, "Demo", <FaDownload />, "demo")}
              {renderButton(video, "", <FaPlay />, "video")}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Gproject;
