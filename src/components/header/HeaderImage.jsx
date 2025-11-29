import React from "react";
import { motion } from "framer-motion";
import LoaderCom from "../Utilities/LoaderCom";

// Floating animation for profile image
const floatingAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: [0, -10, 0],
    transition: {
      opacity: { duration: 0.6 },
      scale: { duration: 0.6 },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

const HeaderImage = ({ aboutmeData }) => {
  return (
    <motion.div
      className="header-img-contant"
      initial="initial"
      animate="animate"
      variants={floatingAnimation}
    >
      <div className="header-img hover-effect image-3d-effect">
        {aboutmeData.heaaderimag ? (
          <img
            src={aboutmeData.heaaderimag}
            alt="profile"
            className="profile-image"
          />
        ) : (
          <LoaderCom />
        )}
      </div>
    </motion.div>
  );
};

export default HeaderImage;
