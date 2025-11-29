import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaGithub, FaGlobe, FaPlay } from "react-icons/fa";
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

function Gproject({ gproject }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!gproject) return null;

  const { title, video, description, github, demo, codeStatus } = gproject;

  const renderButton = (link, text, icon) => {
    if (!link) return null;

    return (
      <motion.a
        className={
          text === "GitHub" && codeStatus === "PRIVATE" ? "btn disabled" : "btn"
        }
        href={link}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{text}</span> {icon}
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
      {/* Parallax Background */}
      <motion.div className="gproject_parallax_bg" style={{ y: backgroundY }} />

      <motion.div className="gproject_card" variants={itemVariants}>
        <motion.h3 variants={itemVariants}>
          <FaRocket className="rocket-icon" />
          {title || ""}
        </motion.h3>
        <div className="gproject_card_body">
          {video && (
            <motion.div
              className="gproject_card_video"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(
                  video
                )}?autoplay=0&mute=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
                width="100%"
                height="315"
              />
            </motion.div>
          )}
          <motion.div className="gproject_card_content" variants={itemVariants}>
            <p>{description || "No description available"}</p>
            <motion.div
              className="card-buttons w-100 justify-content-start gap-5"
              variants={itemVariants}
            >
              {renderButton(github, "GitHub", <FaGithub />)}
              {renderButton(demo, "Demo", <FaGlobe />)}
              {renderButton(video, "Video", <FaPlay />)}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Gproject;
