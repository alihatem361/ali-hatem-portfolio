import { useTranslation } from "react-i18next";
import { FaFileDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import CV from "../../assets/abdulrahman_mobileDeveloper13.pdf";
import { handleDownloadCv } from "../../helpers/index.js";
import PreviewCvModal from "../Auth/PreviewCvModal";
import SocialMedia from "../SocialMedia/index";

// Animation variants for staggered fade-in
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
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const HeaderBio = ({ aboutmeData }) => {
  const { i18n } = useTranslation();

  // Get short bio (first 2 lines only for hook)
  const getShortBio = () => {
    if (aboutmeData.bio && aboutmeData.bio.length > 0) {
      return aboutmeData.bio.slice(0, 2);
    }
    return [];
  };

  return (
    <motion.div
      className="header-text"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.h4 variants={itemVariants}>
          {i18n.language === "en" ? "Hi👋" : "مرحبا 👋"}
        </motion.h4>
        <motion.h2 variants={itemVariants}>
          {i18n.language === "en" ? "I'm" : "أنا"} {aboutmeData.name} 👨‍💻
        </motion.h2>
        <motion.p variants={itemVariants} className="bio-text">
          {getShortBio().map((item, index) => (
            <span key={index}>
              {item}
              <br />
            </span>
          ))}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="header-buttons d-flex justify-content-start gap-3"
        >
          <button
            className="btn btn-primary-accent"
            onClick={() => handleDownloadCv(CV, "Ali_Hatem_Ramadan_Resume")}
          >
            CV{" "}
            <FaFileDownload
              style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}
            />
          </button>
          <PreviewCvModal />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="header-social">
        <SocialMedia />
      </motion.div>
    </motion.div>
  );
};

export default HeaderBio;
